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

import { CodeInformation, getStatusButton, updateStatusButton } from "../content_scripts_common";
import "../content_scripts_common"; // For side effects
import { getContainerElement } from "../containerElement";
import { detectCodeMirrorInstances } from "../github/containerLogic";

let containerElement = getContainerElement();

export const runCodeValidation = (codeInformation: CodeInformation) => {
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

  chrome.runtime.sendMessage(
    {
      contentScriptQuery: "validateCode",
      data: {
        code,
        language,
        filename,
        id: codeElement.getAttribute(CODIGA_ELEMENT_ID_KEY),
      },
    },
    (result) => {
      if (!result || !result.violations || !result.violations.length) {
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

            if (timer) {
              clearTimeout(timer);
            }

            timer = setTimeout(function () {
              updateStatusButton(statusButton, result.violations);
              addHighlights(
                codigaExtensionHighlightsElement,
                result.violations,
                codeElement
              );
            }, 150);
          },
          false
        );
      }
    }
  );
};


const addHighlights = (
  codigaExtensionHighlightsElement: CodigaElement,
  violations: Violation[],
  codeElement: HTMLElement
) => {
  resetComponentShadowDOM(codigaExtensionHighlightsElement);

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
    } else {
      addHiglightToViewViolation(
        violation,
        codigaExtensionHighlightsElement,
        codeElement
      );
    }
  });
};


// Start point
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  if (request.action === "updateContainer") {
      containerElement = getContainerElement();
      
      if (containerElement.isView) {
        const container = containerElement.container;
        if (container) {
          const topOffset = container.offsetTop;
          addLogicToCodeBoxInstance(
            containerElement.container,
            topOffset,
            containerElement
          );
        }
      }

      if (containerElement.isEdit) {
          const container = containerElement.container;
          if (container) {
              const observer = new MutationObserver(detectCodeMirrorInstances);
              observer.observe(container, { childList: true, subtree: true });
          }
      }
  }

  sendResponse({ result: true });
});