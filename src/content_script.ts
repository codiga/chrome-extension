import CodigaElement from "./customelements/CodigaElement";
import {
  CODIGA_ELEMENT_ID_KEY
} from "./github/containerElement";
import { resetComponentShadowDOM } from "./utils";
import {
  CodigaStatus,
} from "./customelements/CodigaStatus";
import {
  addHiglightToEditViolation,
} from "./github/edit/containerLogic";
import {
  addHiglightToViewViolation,
} from "./github/view/containerLogic";
import '@webcomponents/custom-elements';

import { CodeInformation, getStatusButton, updateStatusButton, containerElement } from "./content_scripts_common";
import "./content_scripts_common"; // For side effects

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


