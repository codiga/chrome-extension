import { runCodeValidation } from "./content_script";

import CodigaElement from "../customelements/CodigaElement";
import CodigaExtension from "../customelements/CodigaExtension";
import CodigaExtensionHighLights from "../customelements/CodigaExtensionHighlights";
import {
  assignSize,
  getDetectedSelector,
  getDimensions,
  getPos,
} from "../utils";
import { CODIGA_ELEMENT_ID_KEY } from "../containerElement";
import { pickFilename } from "./pickFilename";
import { pickLanguage } from "../pickLanguage";
import { Violation } from "../types";
import { LineRange, setUpHighlights } from "../containerLogicCommons";
import {
  CODE_CELL_CLASS,
  CODE_MIRROR_CODE_CLASS,
  CODE_MIRROR_LINE,
  CODE_MIRROR_LINES_CLASS,
  CODE_MIRROR_LINE_CLASS,
  CODE_MIRROR_SCROLL_CLASS,
  CODIGA_END,
  CODIGA_EXTENSION,
  CODIGA_START,
  JP_CODE_CELL_CLASS,
  ROLE_PRESENTATION,
} from "../constants";

type CodeEventContext = {
  codigaExtensionElement: CodigaExtension;
  codigaExtensionHighlightsElement: CodigaExtensionHighLights;
  codeElement: HTMLElement;
  scrollContainer: HTMLElement;
  codeMirror: HTMLElement;
};

const codeContexts = [];

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

  const code = getAllCode();
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
    runCodeValidation(codigaContext, codeMirror);
  }
};

export const addHiglightToEditViolation = (
  violation: Violation,
  codigaExtensionHighlightsElement: CodigaElement,
  codeElement: HTMLElement,
  lineRange: LineRange
) => {
  const line = violation.line;

  if (line >= lineRange.startLine && line < lineRange.endLine) {
    const lineToHighlight = codeElement.children
      .item(line - lineRange.startLine)
      .querySelector("span");

    if (!lineToHighlight) return;

    const highlightPosition = getPos(lineToHighlight);
    const highlightDimensions = getDimensions(lineToHighlight);
    const elementRef = codeElement.getAttribute(CODIGA_ELEMENT_ID_KEY);

    setUpHighlights(
      codigaExtensionHighlightsElement,
      elementRef,
      highlightPosition,
      highlightDimensions,
      violation
    );
  }
};

export const addCodeMirrorListeners = () => {
  const codeMirrorList = Array.from(
    document.querySelectorAll(getDetectedSelector(JP_CODE_CELL_CLASS, false))
  )
    .concat(
      Array.from(
        document.querySelectorAll(getDetectedSelector(CODE_CELL_CLASS, false))
      )
    )
    .map((element) => <HTMLElement>element);
  codeMirrorList.forEach(addLogicToCodeMirrorInstance);
};

// This function sets the lines of the document as a whole for a specific CodeMirror
// instance as attributes to the CodeMirror element.
const setCodeMirrorLinesRange = () => {
  const detectedCodeMirrorInstances = Array.from(
    document.querySelectorAll(getDetectedSelector(JP_CODE_CELL_CLASS))
  )
    .concat(
      Array.from(
        document.querySelectorAll(getDetectedSelector(CODE_CELL_CLASS))
      )
    )
    .map((element) => <HTMLElement>element);

  detectedCodeMirrorInstances.reduce((acc, cm) => {
    cm.setAttribute(CODIGA_START, `${acc}`);
    const codeMirrorLines = cm.querySelectorAll(CODE_MIRROR_LINE_CLASS).length;
    cm.setAttribute(CODIGA_END, `${acc + codeMirrorLines}`);
    return acc + codeMirrorLines;
  }, 1);
};

const addLogicToCodeMirrorInstance = (
  codeMirror: HTMLElement,
  index: number
) => {
  codeMirror.setAttribute("detected", `${true}`);

  const codeMirrorLines = codeMirror.querySelector(CODE_MIRROR_LINES_CLASS);
  const codeScroll = <HTMLElement>(
    codeMirror.querySelector(CODE_MIRROR_SCROLL_CLASS)
  );

  const codePresentation = codeMirrorLines?.querySelector(ROLE_PRESENTATION);

  const codeElement = <HTMLElement>(
    codeMirror.querySelector(CODE_MIRROR_CODE_CLASS)
  );
  codeElement?.setAttribute(
    CODIGA_ELEMENT_ID_KEY,
    JSON.stringify(getPos(<HTMLElement>codeElement))
  );

  const codigaExtensionElement = <CodigaExtension>(
    document.createElement(CODIGA_EXTENSION)
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

  codeContexts.push(context);
  codeContexts.forEach((ctx) => eventListenerCallback(ctx));
  const onCodeElementChange = () => {
    setCodeMirrorLinesRange();
    codeContexts.forEach((ctx) => eventListenerCallback(ctx));
  };

  const observer = new MutationObserver(onCodeElementChange);
  observer.observe(codeElement, { childList: true, subtree: true });

  window.addEventListener("resize", () => {
    assignSize(codigaExtensionElement, codeMirror);
  });
};

const getAllCode = () => {
  return Array.from(
    document.querySelectorAll(getDetectedSelector(JP_CODE_CELL_CLASS))
  )
    .concat(
      Array.from(
        document.querySelectorAll(getDetectedSelector(CODE_CELL_CLASS))
      )
    )
    .flatMap((codeBlock) => codeBlock.querySelector(CODE_MIRROR_CODE_CLASS))
    .map((cm) => <HTMLElement>cm)
    .reduce((acc, curr) => {
      return acc + getCodeFromCodeElement(curr) + "\n";
    }, "");
};

const getCodeFromCodeElement = (codeElement: HTMLElement): string => {
  return Array.from(codeElement.children)
    .map((lineElement) => {
      if (lineElement.getAttribute("class")?.includes(CODE_MIRROR_LINE)) {
        return lineElement.textContent.replace(/\u200B/g, "");
      } else {
        const codeLine = lineElement.querySelector(CODE_MIRROR_LINE_CLASS);
        return codeLine.textContent.replace(/\u200B/g, "");
      }
    })
    .join("\n");
};
