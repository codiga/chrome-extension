import {
    runCodeValidation,
} from "./content_script";
import { addTooltipToHighlight } from "../content_scripts_common";

import CodigaElement from "../customelements/CodigaElement";
import CodigaExtension from "../customelements/CodigaExtension";
import CodigaExtensionHighLights from "../customelements/CodigaExtensionHighlights";
import CodigaHighlight from "../customelements/CodigaHighlight";
import { assignSize, getDimensions, getPos } from "../utils";
import { CODIGA_ELEMENT_ID_KEY } from "../containerElement";
import { pickFilename } from "./pickFilename";
import { pickLanguage } from "../pickLanguage";
import { Violation } from "../types";

export const detectCodeMirrorInstances = (
    mutationsList: { type: string }[]
) => {
    for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
        addCodeMirrorListeners();
    }
    }
};

type CodeEventContext = {
    codigaExtensionElement: CodigaExtension;
    codigaExtensionHighlightsElement: CodigaExtensionHighLights;
    codeElement: HTMLElement;
    scrollContainer: HTMLElement;
    codeMirror: HTMLElement;
};
const eventListenerCallback = (codeEventContext: CodeEventContext) => {
    const {
    codigaExtensionElement,
    codigaExtensionHighlightsElement,
    codeElement,
    scrollContainer,
    codeMirror,
    } = codeEventContext;

    assignSize(codigaExtensionHighlightsElement, codeMirror);
    assignSize(codigaExtensionElement, codeMirror);

    const code = getCodeFromCodeElement(codeElement);
    const filename = pickFilename();
    const language = pickLanguage(filename);

    if (language && filename) {
        const codigaContext = {
            code,
            language,
            codigaExtensionHighlightsElement,
            codigaExtensionElement,
            codeElement,
            filename,
            scrollContainer,
        };
        runCodeValidation(codigaContext);
    }
};

export const addHiglightToEditViolation = (
    violation: Violation,
    codigaExtensionHighlightsElement: CodigaElement,
    codeElement: HTMLElement
) => {
    const line = violation.line;
    const lineToHighlight = codeElement.children.item(line - 1).querySelector('span');
    if (!lineToHighlight) return;

    const highlightPosition = getPos(lineToHighlight);
    const highlightDimensions = getDimensions(lineToHighlight)
    const highlightsWrapperPosition = getPos(codigaExtensionHighlightsElement);
    const codigaHighlight = <CodigaHighlight>(
        document.createElement("codiga-highlight")
    );

    codigaHighlight.classList.add("codiga-highlight");

    codigaHighlight.top = highlightPosition.y - highlightsWrapperPosition.y;
    codigaHighlight.left = highlightPosition.x - highlightsWrapperPosition.x;

    codigaHighlight.width = highlightDimensions.width;
    codigaHighlight.height = highlightDimensions.height;

    const createdElements = addTooltipToHighlight(codigaHighlight, violation);

    codigaExtensionHighlightsElement.shadowRoot.appendChild(codigaHighlight);

    createdElements.forEach((createdElement) => {
        codigaExtensionHighlightsElement.shadowRoot.appendChild(createdElement);
    });
};

const addCodeMirrorListeners = () => {
    const codeMirrorList = Array.from(
        document.querySelectorAll(".CodeMirror:not([detected=true])")
    ).map((element) => <HTMLElement>element);
    codeMirrorList.forEach(addLogicToCodeMirrorInstance);
};

const addLogicToCodeMirrorInstance = (codeMirror: HTMLElement) => {
    codeMirror.setAttribute("detected", `${true}`);
    
    const codeMirrorLines = codeMirror.querySelector(".CodeMirror-lines");
    const codeScroll = <HTMLElement>(
    codeMirror.querySelector(".CodeMirror-scroll")
    );

    const codePresentation = codeMirrorLines?.querySelector(
    '[role="presentation"]'
    );

    const codeElement = <HTMLElement>codeMirror.querySelector(".CodeMirror-code");
    codeElement?.setAttribute(
    CODIGA_ELEMENT_ID_KEY,
    JSON.stringify(getPos(<HTMLElement>codeElement))
    );

    const codigaExtensionElement = <CodigaExtension>(
    document.createElement("codiga-extension")
    );
    codigaExtensionElement.style.cssText +=
    "position: absolute; top: 0px; left: 0px";
    codeMirror.insertBefore(codigaExtensionElement, codeMirror.firstChild);

    const codigaExtensionHighlightsElement = <CodigaExtensionHighLights>(
    document.createElement("codiga-extension-highlights")
    );
    codigaExtensionHighlightsElement.style.cssText +=
    "position: absolute; top: 0px; left: 0px";
    codePresentation?.insertBefore(
    codigaExtensionHighlightsElement,
    codePresentation.firstChild
    );
        
    const context = {
        codeMirror,
        codigaExtensionElement,
        codigaExtensionHighlightsElement,
        codeElement,
        scrollContainer: codeScroll,
    };

    eventListenerCallback(context);
    
    const onCodeElementChange = () => {
        eventListenerCallback(context);
    }
    const observer = new MutationObserver(onCodeElementChange);
    observer.observe(codeElement, { childList: true, subtree: true });

    window.addEventListener("resize", () => {
        assignSize(codigaExtensionElement, codeMirror);
    });
};

const getCodeFromCodeElement = (codeElement: HTMLElement) => {
    return Array.from(codeElement.children).map(lineElement => {
        if(lineElement.getAttribute("class").includes("CodeMirror-line")){
            return lineElement.textContent.replace(/\u200B/g,'');
        } else {
            const codeLine = lineElement.querySelector(".CodeMirror-line")
            return codeLine.textContent.replace(/\u200B/g,'');
        }
    }).join("\n");
};