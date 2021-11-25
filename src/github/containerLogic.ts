import {
  runCodeValidation,
} from "./content_script";
import { getHighlightDimensions } from "../content_scripts_common";
import CodigaElement from "../customelements/CodigaElement";
import CodigaExtension from "../customelements/CodigaExtension";
import CodigaExtensionHighLights from "../customelements/CodigaExtensionHighlights";
import { assignSize, getDetectedSelector, getPos } from "../utils";
import { CODIGA_ELEMENT_ID_KEY } from "../containerElement";

import { pickFilename } from "./pickFilename";
import { pickLanguage } from "../pickLanguage";
import { Violation } from "../types";
import { setUpHighlights } from "../containerLogicCommons";
import { CODE_MIRROR_CLASS, CODE_MIRROR_CODE_CLASS, CODE_MIRROR_GUTTER_WRAPPER_CLASS, CODE_MIRROR_LINE, CODE_MIRROR_LINES_CLASS, CODE_MIRROR_LINE_CLASS, CODE_MIRROR_SCROLL_CLASS, ROLE_PRESENTATION } from "../constants";

type CodeEventContext = {
  codigaExtensionElement: CodigaExtension;
  codigaExtensionHighlightsElement: CodigaExtensionHighLights;
  codeElement: HTMLElement;
  textArea: HTMLTextAreaElement;
  scrollContainer: HTMLElement;
  codeMirror: HTMLElement;
};
const eventListenerCallback = (codeEventContext: CodeEventContext) => {
  const {
    codigaExtensionElement,
    codigaExtensionHighlightsElement,
    codeElement,
    textArea,
    scrollContainer,
    codeMirror,
  } = codeEventContext;

  assignSize(codigaExtensionHighlightsElement, codeMirror);
  assignSize(codigaExtensionElement, codeMirror);

  const code = getCodeFromTextArea(textArea);
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
  const lineToHighlight = Array.from(codeElement.children).find((child) => {
    return (
      child.querySelector(CODE_MIRROR_GUTTER_WRAPPER_CLASS)?.textContent ===
      `${line}`
    );
  });
  if (!lineToHighlight) return;

  const lineToHighlightClass = lineToHighlight.getAttribute("class");
  const isCodeMirrorLine =
    lineToHighlightClass && lineToHighlightClass.includes(CODE_MIRROR_LINE);
  const codeWrapperElement = isCodeMirrorLine
    ? lineToHighlight
    : lineToHighlight.querySelector(CODE_MIRROR_LINE_CLASS);
  const codeToHighlightElement = codeWrapperElement?.querySelector(
    ROLE_PRESENTATION
  );

  if (codeToHighlightElement) {
    const codeToHighlight = <HTMLElement>codeToHighlightElement;
    const highlightPosition = getPos(codeToHighlight);
    const highlightDimensions = getHighlightDimensions(
      codeToHighlight,
      <HTMLElement>codeWrapperElement
    );
    
    const elementRef = codeElement.getAttribute(CODIGA_ELEMENT_ID_KEY);
    setUpHighlights(codigaExtensionHighlightsElement, elementRef, highlightPosition, highlightDimensions, violation);
  }
};

export const addCodeMirrorListeners = () => {
  const codeMirrorList = Array.from(
    document.querySelectorAll(getDetectedSelector(CODE_MIRROR_CLASS, false))
  ).map((element) => <HTMLElement>element);
  codeMirrorList.forEach(addLogicToCodeMirrorInstance);
};

const addLogicToCodeMirrorInstance = (codeMirror: HTMLElement) => {
  codeMirror.setAttribute("detected", `${true}`);

  const codeMirrorLines = codeMirror.querySelector(CODE_MIRROR_LINES_CLASS);
  const codeScroll = <HTMLElement>(
    codeMirror.querySelector(CODE_MIRROR_SCROLL_CLASS)
  );

  const codePresentation = codeMirrorLines?.querySelector(
    '[role="presentation"]'
  );

  const codeElement = <HTMLElement>codeMirror.querySelector(CODE_MIRROR_CODE_CLASS);
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

  const textArea = codeMirror.parentElement?.querySelector("textarea");
  
  if (textArea) {
    const context = {
      codeMirror,
      codigaExtensionElement,
      codigaExtensionHighlightsElement,
      codeElement,
      textArea,
      scrollContainer: codeScroll,
    };
    
    eventListenerCallback(context);

    textArea.addEventListener("change", () => {
      eventListenerCallback(context);
    });

    textArea.addEventListener("input", () => {
      eventListenerCallback(context);
    });

    window.addEventListener("resize", () => {
      assignSize(codigaExtensionElement, codeMirror);
    });
  }
};

const getCodeFromTextArea = (textarea: HTMLTextAreaElement) => {
  return textarea.value;
};
