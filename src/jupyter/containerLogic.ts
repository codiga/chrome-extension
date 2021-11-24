import { runCodeValidation } from "./content_script";

import CodigaElement from "../customelements/CodigaElement";
import CodigaExtension from "../customelements/CodigaExtension";
import CodigaExtensionHighLights from "../customelements/CodigaExtensionHighlights";
import { assignSize, getDimensions, getPos } from "../utils";
import { CODIGA_ELEMENT_ID_KEY } from "../containerElement";
import { pickFilename } from "./pickFilename";
import { pickLanguage } from "../pickLanguage";
import { Violation } from "../types";
import { LineRange, setUpHighlights } from "../containerLogicCommons";

type CodeEventContext = {
  codigaExtensionElement: CodigaExtension;
  codigaExtensionHighlightsElement: CodigaExtensionHighLights;
  codeElement: HTMLElement;
  scrollContainer: HTMLElement;
  codeMirror: HTMLElement;
};

<<<<<<< HEAD
const codeContexts = [];

=======
>>>>>>> 96c36655173b2f9b8ff062daa7cd5bfde0add7f0
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

<<<<<<< HEAD
=======
  const lineRange: LineRange = {
    startLine: Number(codeMirror.getAttribute("codiga-start")),
    endLine: Number(codeMirror.getAttribute("codiga-end")),
  };

  setCodeMirrorLinesRange();
>>>>>>> 96c36655173b2f9b8ff062daa7cd5bfde0add7f0
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
<<<<<<< HEAD
    runCodeValidation(codigaContext, codeMirror);
=======
    runCodeValidation(codigaContext, lineRange);
>>>>>>> 96c36655173b2f9b8ff062daa7cd5bfde0add7f0
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
<<<<<<< HEAD
    document.querySelectorAll(".jp-CodeCell:not([detected=true])")
  )
    .concat(
      Array.from(document.querySelectorAll(".code_cell:not([detected=true])"))
    )
    .map((element) => <HTMLElement>element);
=======
    document.querySelectorAll(".CodeMirror:not([detected=true])")
  ).map((element) => <HTMLElement>element);
>>>>>>> 96c36655173b2f9b8ff062daa7cd5bfde0add7f0
  codeMirrorList.forEach(addLogicToCodeMirrorInstance);
};

// This function sets the lines of the document as a whole for a specific CodeMirror
// instance as attributes to the CodeMirror element.
const setCodeMirrorLinesRange = () => {
  const detectedCodeMirrorInstances = Array.from(
<<<<<<< HEAD
    document.querySelectorAll(".jp-CodeCell[detected=true]")
  )
    .concat(
      Array.from(document.querySelectorAll(".code_cell[detected=true]"))
    )
    .map((element) => <HTMLElement>element);
=======
    document.querySelectorAll(".CodeMirror[detected=true]")
  ).map((element) => <HTMLElement>element);
>>>>>>> 96c36655173b2f9b8ff062daa7cd5bfde0add7f0

  detectedCodeMirrorInstances.reduce((acc, cm) => {
    cm.setAttribute("codiga-start", `${acc}`);
    const codeMirrorLines = cm.querySelectorAll(".CodeMirror-line").length;
    cm.setAttribute("codiga-end", `${acc + codeMirrorLines}`);
    return acc + codeMirrorLines;
  }, 1);
};

const addLogicToCodeMirrorInstance = (
  codeMirror: HTMLElement,
  index: number
) => {
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
<<<<<<< HEAD

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
  return Array.from(document.querySelectorAll(".jp-CodeCell[detected=true]"))
    .concat(
      Array.from(document.querySelectorAll(".code_cell[detected=true]"))
    )
    .flatMap((codeBlock) => codeBlock.querySelector(".CodeMirror-code"))
    .map((cm) => <HTMLElement>cm)
    .reduce((acc, curr) => {
      return acc + getCodeFromCodeElement(curr) + "\n";
    }, "");
};

=======

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
  };
  const observer = new MutationObserver(onCodeElementChange);
  observer.observe(codeElement, { childList: true, subtree: true });

  window.addEventListener("resize", () => {
    assignSize(codigaExtensionElement, codeMirror);
  });
};

const getAllCode = () => {
  return Array.from(document.querySelectorAll(".CodeMirror-code"))
    .map((cm) => <HTMLElement>cm)
    .reduce((acc, curr) => {
      return acc + getCodeFromCodeElement(curr) + "\n";
    }, "");
};

>>>>>>> 96c36655173b2f9b8ff062daa7cd5bfde0add7f0
const getCodeFromCodeElement = (codeElement: HTMLElement): string => {
  return Array.from(codeElement.children)
    .map((lineElement) => {
      if (lineElement.getAttribute("class")?.includes("CodeMirror-line")) {
        return lineElement.textContent.replace(/\u200B/g, "");
      } else {
        const codeLine = lineElement.querySelector(".CodeMirror-line");
        return codeLine.textContent.replace(/\u200B/g, "");
      }
    })
    .join("\n");
};
