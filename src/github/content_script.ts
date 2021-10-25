import CodigaElement from "../customelements/CodigaElement";
import {
  CODIGA_ELEMENT_ID_KEY
} from "../containerElement";
import { resetComponentShadowDOM } from "../utils";
import {
  CodigaStatus,
} from "../customelements/CodigaStatus";
import {
  addHiglightToEditViolation,
} from "./containerLogic";
import {
  addHiglightToViewViolation, addLogicToCodeBoxInstance,
} from "./view/containerLogic";
import '@webcomponents/custom-elements';

import { CodeInformation, createPopups, getStatusButton, removeTooltips, updateStatusButton } from "../content_scripts_common";
import "../content_scripts_common"; // For side effects
import { getContainerElement } from "../containerElement";
import { detectCodeMirrorInstances } from "../github/containerLogic";
import { addDiffListeners, addHiglightToPullViolation, detectDiffInstances } from "./pull/containerLogic";

import GitHub from 'github-api';
import { Repository } from "github-api/dist/components/Repository";
import parseDiff from "parse-diff";
import { validateCode } from "../validateCode";
import { Violation } from "../types";
import Toastify from 'toastify-js'
import { ADD_CODE_VALIDATION, GITHUB_KEY } from "../constants";

let containerElement = getContainerElement();
let isShowingErrorToast = false;

export const runCodeValidation = async (codeInformation: CodeInformation) => {
  const {
    code,
    language,
    codigaExtensionHighlightsElement,
    codigaExtensionElement,
    codeElement,
    filename,
    scrollContainer,
  } = codeInformation;
  const statusButton = getStatusButton(codigaExtensionElement);
  statusButton.status = CodigaStatus.LOADING;

  resetComponentShadowDOM(codigaExtensionHighlightsElement);
  const elementRef = codeElement.getAttribute(CODIGA_ELEMENT_ID_KEY);
  removeTooltips(elementRef);

  try {
    const result = await validateCode({
      code,
      language,
      filename,
      id: codeElement.getAttribute(CODIGA_ELEMENT_ID_KEY),
    });
    if(!result) return;
    if (!result.violations || !result.violations.length) {
      statusButton.status = CodigaStatus.ALL_GOOD;
    } else {
      addHighlights(
        codigaExtensionHighlightsElement,
        result.violations,
        codeElement
      );
      updateStatusButton(statusButton, result.violations);
  
      // On scroll highlights should be updated
      let timer: NodeJS.Timeout;
      scrollContainer.addEventListener(
        "scroll",
        function () {
          resetComponentShadowDOM(codigaExtensionHighlightsElement);
          const elementRef = codeElement.getAttribute(CODIGA_ELEMENT_ID_KEY);
          removeTooltips(elementRef);

          if (timer) {
            clearTimeout(timer);
          }
  
          timer = setTimeout(function () {
            if(statusButton.status !== CodigaStatus.LOADING){
              addHighlights(
                codigaExtensionHighlightsElement,
                result.violations,
                codeElement
              );
            }
          }, 50);
        },
        false
      );
    }
  } catch (e) {}
};


export const addHighlights = (
  codigaExtensionHighlightsElement: CodigaElement,
  violations: Violation[],
  codeElement: HTMLElement
) => {
  resetComponentShadowDOM(codigaExtensionHighlightsElement);
  const elementRef = codeElement.getAttribute(CODIGA_ELEMENT_ID_KEY);
  removeTooltips(elementRef);

  const codigaHighlightsStyle = document.createElement("style");
  codigaHighlightsStyle.innerHTML = `
      .codiga-highlight {
          position: absolute;
          z-index: 3; 
      }

      /* Slide in */
      .codiga-highlight {
          overflow: hidden;
      }

      @keyframes slidein {
          from {
            transform: translate3d(-100%, 0, 0);
          }
        
          to {
            transform: translate3d(0, 0, 0);
          }
      }

      .codiga-highlight::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 0.1rem;
          background-color: #cc498b;
          opacity: 1;
          animation: slidein .2s;
      }
      
      .codiga-highlight:hover{
          background: #c1424282;
      }
  `;
  codigaExtensionHighlightsElement.shadowRoot.appendChild(
    codigaHighlightsStyle
  ); 

  violations.forEach((violation) => {
    if (containerElement.isEdit) {
      // Edit views also have .repository-content component
      addHiglightToEditViolation(
        violation,
        codigaExtensionHighlightsElement,
        codeElement
      );
    } else if(containerElement.isView){
      addHiglightToViewViolation(
        violation,
        codigaExtensionHighlightsElement,
        codeElement
      );
    } else if(containerElement.isPull){
      addHiglightToPullViolation(
        violation,
        codigaExtensionHighlightsElement,
        codeElement
      );
    }
  });
};

const getPullRequestFilesInformation = async (repo: Repository, owner: string, repoName: string, pullNumber: string) => {
  // Right now we only get the first 100 files of a PR
  const response = await repo._request('GET', `/repos/${owner}/${repoName}/pulls/${pullNumber}/files`, {per_page: 100});
  return response.data;
}

const getPullRequestDiff = async (repo: Repository, owner: string, repoName: string, pullNumber: string) => {
  // Right now we only get the first 100 files of a PR
  const response = await repo._request('GET', `/repos/${owner}/${repoName}/pulls/${pullNumber}.diff`, {
    AcceptHeader: 'v3.diff'
  });
  return response.data;
}

// Start point
createPopups();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === ADD_CODE_VALIDATION) {
      containerElement = getContainerElement();
      if (containerElement.isView) {
        const container = <HTMLElement> containerElement.container;
        if (container) {
          const topOffset = container.offsetTop;
          addLogicToCodeBoxInstance(
            container,
            topOffset,
            containerElement
          );
        }
      }

      if (containerElement.isEdit) {
          const container = <HTMLElement> containerElement.container;
          if (container) {
              const observer = new MutationObserver(detectCodeMirrorInstances);
              observer.observe(container, { childList: true, subtree: true });
          }
      }

      if (containerElement.isPull) {
        const container = <HTMLElement> containerElement.container;

        chrome.storage.sync.get([GITHUB_KEY], async function(obj){
          try {
            const token = obj[GITHUB_KEY];
            const gh = token?new GitHub({ token }):new GitHub();
            const repository = location.href.match(/(?<=github.com\/).*(?=\/pull)/);
            const pr = location.href.match(/(?<=\/pull\/).*(?=\/file)/)?.toString();
            const [username, repoName] = repository.toString().split('/');
            const repo = gh.getRepo(username, repoName);
            const filesInformation = await getPullRequestFilesInformation(repo, username, repoName, pr);

            const diffText = await getPullRequestDiff(repo, username, repoName, pr);
            const diffInformation = parseDiff(diffText);
            
            const mutationFunction = detectDiffInstances(repo, filesInformation, diffInformation);
            addDiffListeners(repo, filesInformation, diffInformation);

            if (container) {
                const observer = new MutationObserver(mutationFunction);
                observer.observe(container, { childList: true, subtree: true });
            }
            // eventListenerCallback(context);
          } catch (e) {
            if(!isShowingErrorToast){
              Toastify({
                text: `<img src='${chrome.runtime.getURL("icon16.png")}'/><br/> GitHub API Token not set or not valid for this repository`,
                destination: "https://github.com/settings/tokens",
                newWindow: true,
                close: true,
                stopOnFocus: true,
                escapeMarkup: false,
                duration: 5000,
                style: {
                  background: "#300623",
                  color: "white",
                  "font-size": ".8rem",
                }
              }).showToast();

              isShowingErrorToast = true;

              setTimeout(() => {
                isShowingErrorToast = false
              }, 5000);
            }
          }
        });
    }
  }

  sendResponse({ result: true });
});