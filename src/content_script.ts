import CodigaElement from "./customelements/CodigaElement";
import CodigaExtension from "./customelements/CodigaExtension";
import {
  CODIGA_ELEMENT_ID_KEY,
  getContainerElement,
} from "./github/containerElement";
import { getDimensions, getPos, resetComponentShadowDOM } from "./utils";
import { createPopper, Instance } from "@popperjs/core";
import CodigaExtensionHighLights from "./customelements/CodigaExtensionHighlights";
import CodigaStatusButton, {
  CodigaStatus,
} from "./customelements/CodigaStatus";
import {
  addHiglightToEditViolation,
  detectCodeMirrorInstances,
} from "./github/edit/containerLogic";
import {
  addHiglightToViewViolation,
  addLogicToCodeBoxInstance,
} from "./github/view/containerLogic";

// General functionality
const PRETTY_CATEGORIES: Record<string, string> = {
  Code_Style: "Code style",
  Error_Prone: "Error prone",
  Documentation: "Documentation",
  Security: "Security",
  Design: "Design",
  Safety: "Safety",
  Best_Practice: "Best practice",
  Unknown: "Unknown",
};
import '@webcomponents/custom-elements';
import CodigaHighlight from "./customelements/CodigaHighlight";


let containerElement = getContainerElement();
const config = { childList: true, subtree: true };

type CodeInformation = {
  code: string;
  language: string;
  codigaExtensionHighlightsElement: any;
  codigaExtensionElement: any;
  codeElement: HTMLElement;
  filename: string;
  scrollContainer: HTMLElement;
};

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

const showTooltip = (tooltip: HTMLDivElement, popperInstance: Instance) => {
  return () => {
    tooltip.setAttribute("data-show", "");

    // We need to tell Popper to update the tooltip position
    // after we show the tooltip, otherwise it will be incorrect
    popperInstance.update();
  };
};

const hideTooltip = (tooltip: HTMLDivElement) => {
  return () => {
    tooltip.removeAttribute("data-show");
  };
};

export const getHighlightDimensions = (
  codeToHighlight: HTMLElement,
  lineToHighlight: HTMLElement
) => {
  return lineToHighlight.textContent?.replace(/\u200B/g, "").length
    ? getDimensions(codeToHighlight)
    : getDimensions(lineToHighlight);
};

export const addTooltipToHighlight = (
  highlight: HTMLElement,
  violation: Violation
) => {
  const tooltip = document.createElement("div");
  const style = document.createElement("style");
  style.innerHTML = `
      .codiga-tooltip {
          display: none;
      }

      .codiga-tooltip[data-show] {
          background: #300623;
          color: white;
          display: block;
          min-width: max-content;
          z-index: 10;
          border-radius: .2rem;
          padding: .6rem;
          border: 1px solid white;
      }
      
      .single-violation {
          border-top: 1px solid white;
          padding: .4rem 0;
      }
  `;

  tooltip.innerHTML = `
      <img src='${chrome.runtime.getURL("icon16.png")}'/>
      <div class="violations-list">
      ${violation.group
        .map((violation, index) => {
          return `<div class="single-violation">
                  <div class="codiga-tooltip-header"><b>${index + 1}. ${
            PRETTY_CATEGORIES[violation.category] || violation.category
          }</b> violation:</div>
                  <div class="codiga-inspector-violation"> ${
                    violation.description
                  } </div>
              </div>`;
        })
        .join("")}
      </div>
      `;
  tooltip.classList.add("codiga-tooltip");

  const popperInstance: Instance = createPopper(highlight, tooltip);

  const showEvents = ["mouseenter", "focus"];
  showEvents.forEach((event) => {
    highlight.addEventListener(event, showTooltip(tooltip, popperInstance));
  });

  const hideEvents = ["mouseleave", "blur"];
  hideEvents.forEach((event) => {
    highlight.addEventListener(event, hideTooltip(tooltip));
  });

  return [tooltip, style];
};

const getStatusButton = (
  codigaExtensionElement: CodigaExtension
): CodigaStatusButton => {
  const codigaWrapper =
    codigaExtensionElement.shadowRoot.querySelector(".codiga-wrapper");
  const codigaButtonDOM = codigaWrapper?.querySelector("codiga-status-btn");

  if (codigaButtonDOM) {
    return <CodigaStatusButton>codigaButtonDOM;
  }

  const codigaButton = <CodigaStatusButton>(
    document.createElement("codiga-status-btn")
  );
  codigaButton.status = CodigaStatus.LOADING;
  codigaWrapper?.appendChild(codigaButton);

  const codigaStatusButtonStyle = document.createElement("style");
  codigaStatusButtonStyle.innerHTML = `
      .codiga-status-btn {
          position: absolute;
          right: 1rem;
          bottom: 1rem;
          z-index: 5;
          border-radius: 100%;
          font-weight: bold;
          width: 26px;
          height: 26px;
          justify-content: center;
          align-items: center;
          display: flex;
          font-size: 15px;
          color: white;
      }

      @keyframes spin { 
          100% { 
              -webkit-transform: rotate(360deg); 
              transform:rotate(360deg); 
          } 
      }

      .clear{
          background: #5ca258;
      }

      .loading{
          background: url(${chrome.runtime.getURL("icon48.png")});
          background-position: center; /* Center the image */
          background-repeat: no-repeat; /* Do not repeat the image */
          background-size: cover;
          animation:spin 4s linear infinite;
      }

      .violations{
          background: #d25b5b;
      }
  `;
  codigaExtensionElement.shadowRoot.appendChild(codigaStatusButtonStyle);

  return codigaButton;
};

const updateStatusButton = (
  statusButton: CodigaStatusButton,
  violations: Violation[]
) => {
  statusButton.status = `${violations.length}` || CodigaStatus.LOADING;
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
        observer.observe(container, config);
      }
    }
  }
  sendResponse({ result: true });
});

console.log("hereeeee");
console.log(window.customElements);

window.customElements.define("codiga-status-btn", CodigaStatusButton);
window.customElements.define("codiga-extension", CodigaExtension);
window.customElements.define("codiga-extension-highlights", CodigaExtensionHighLights);
window.customElements.define("codiga-highlight", CodigaHighlight);
