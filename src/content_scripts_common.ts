import CodigaExtension from "./customelements/CodigaExtension";

import { getDimensions } from "./utils";
import { createPopper, Instance } from "@popperjs/core";
import CodigaExtensionHighLights from "./customelements/CodigaExtensionHighlights";
import CodigaStatusButton, {
  CodigaStatus,
} from "./customelements/CodigaStatus";

import '@webcomponents/custom-elements';
import CodigaHighlight from "./customelements/CodigaHighlight";
import { Violation } from "./types";
import CodigaPopups from "./customelements/CodigaPopups";
import { CODIGA_ELEMENT_ID_KEY } from "./containerElement";

export const PRETTY_CATEGORIES: Record<string, string> = {
  Code_Style: "Code style",
  Error_Prone: "Error prone",
  Documentation: "Documentation",
  Security: "Security",
  Design: "Design",
  Safety: "Safety",
  Best_Practice: "Best practice",
  Unknown: "Unknown",
};

export type CodeInformation = {
  code: string;
  language: string;
  codigaExtensionHighlightsElement: CodigaExtensionHighLights;
  codigaExtensionElement: CodigaExtension;
  codeElement: HTMLElement;
  filename: string;
  scrollContainer: HTMLElement;
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
    codeElementRef: string,
    violation: Violation
) => {
    const tooltip = document.createElement("div");
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
    tooltip.setAttribute('codiga-element-reference', codeElementRef);

    const popperInstance: Instance = createPopper(highlight, tooltip);

    const showEvents = ["mouseenter", "focus"];
        showEvents.forEach((event) => {
        highlight.addEventListener(event, showTooltip(tooltip, popperInstance));
    });

    const hideEvents = ["mouseleave", "blur"];
    hideEvents.forEach((event) => {
        highlight.addEventListener(event, hideTooltip(tooltip));
        tooltip.addEventListener(event, hideTooltip(tooltip));
    });

    return [tooltip];
};
  
export const removeTooltips = (codeElementReference: string) => {
    document.querySelectorAll(`.codiga-tooltip[codiga-element-reference='${codeElementReference}']`)
        .forEach((codigaTooltipElement) => {
            codigaTooltipElement.parentElement.removeChild(codigaTooltipElement);
        });
}

export const getStatusButton = (
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
  
export const updateStatusButton = (
    statusButton: CodigaStatusButton,
    violations: Violation[]
) => {
    statusButton.status = `${violations.length}` || CodigaStatus.LOADING;
};

export const createPopups = () => {
    const popupsElement = document.createElement("codiga-popups");
    document.querySelector('body').append(popupsElement);

    const style = document.createElement("style");
    style.innerHTML = `
        .codiga-tooltip {
            display: none;
        }

        .codiga-tooltip[data-show] {
            background: #300623;
            color: white;
            display: block;
            z-index: 10;
            max-width: 500px;
            border-radius: .2rem;
            padding: .6rem;
            border: 1px solid white;
        }
        
        .single-violation {
            border-top: 1px solid white;
            padding: .4rem 0;
        }
    `;
    document.querySelector('head').append(style);
}

window.customElements.define("codiga-status-btn", CodigaStatusButton);
window.customElements.define("codiga-extension", CodigaExtension);
window.customElements.define("codiga-extension-highlights", CodigaExtensionHighLights);
window.customElements.define("codiga-highlight", CodigaHighlight);
window.customElements.define("codiga-popups", CodigaPopups);