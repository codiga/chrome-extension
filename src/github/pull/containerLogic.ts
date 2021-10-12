import {
  runCodeValidation,
} from "../content_script";
import { addTooltipToHighlight, getHighlightDimensions } from "../../content_scripts_common";
import CodigaElement from "../../customelements/CodigaElement";
import CodigaExtension from "../../customelements/CodigaExtension";
import CodigaExtensionHighLights from "../../customelements/CodigaExtensionHighlights";
import CodigaHighlight from "../../customelements/CodigaHighlight";
import { assignSize, getPos } from "../../utils";
import { CODIGA_ELEMENT_ID_KEY } from "../../containerElement";

import { pickFilename } from "./pickFilename";
import { pickLanguage } from "../../pickLanguage";

import { Repository } from "github-api/dist/components/Repository";

type FileInformation = {sha: string, filename: string}

type CodeEventContext = {
  codigaExtensionElement: CodigaExtension;
  codigaExtensionHighlightsElement: CodigaExtensionHighLights;
  diffContainer: HTMLElement;
  repo: Repository;
  filesInformation: FileInformation[]
};

export const detectDiffInstances = (repo: any, filesInformation: FileInformation[]) => (
  mutationsList: { type: string }[]
) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      addDiffListeners(repo, filesInformation);
    }
  }
};

const startAnalysis = async (codeEventContext: CodeEventContext) => {
  const {
    codigaExtensionElement,
    codigaExtensionHighlightsElement,
    diffContainer,
    repo,
    filesInformation
  } = codeEventContext;

  assignSize(codigaExtensionHighlightsElement, diffContainer);
  assignSize(codigaExtensionElement, diffContainer);

  const filename = pickFilename(diffContainer);
  const language = pickLanguage(filename);
  console.log(filesInformation);
  const file = filesInformation.find(file => file.filename === filename);
  console.log("hereee", filename, file, filesInformation);
  const code = await getBlobFromSha(repo, file.sha);

  if (language && filename) {
    const codigaContext = {
      code,
      language,
      codigaExtensionHighlightsElement,
      codigaExtensionElement,
      codeElement: diffContainer,
      filename,
      scrollContainer: diffContainer,
    };

    console.log(codigaContext);
  }
};

export const addHiglightToPullViolation = (
  violation: Violation,
  codigaExtensionHighlightsElement: CodigaElement,
  codeElement: HTMLElement
) => {
  /*const line = violation.line;
  const lineToHighlight = Array.from(codeElement.children).find((child) => {
    return (
      child.querySelector(".CodeMirror-gutter-wrapper")?.textContent ===
      `${line}`
    );
  });
  if (!lineToHighlight) return;

  const lineToHighlightClass = lineToHighlight.getAttribute("class");
  const isCodeMirrorLine =
    lineToHighlightClass && lineToHighlightClass.includes("CodeMirror-line");
  const codeWrapperElement = isCodeMirrorLine
    ? lineToHighlight
    : lineToHighlight.querySelector(".CodeMirror-line");
  const codeToHighlightElement = codeWrapperElement?.querySelector(
    "[role=presentation]"
  );

  if (codeToHighlightElement) {
    const codeToHighlight = <HTMLElement>codeToHighlightElement;
    const highlightPosition = getPos(codeToHighlight);
    const highlightDimensions = getHighlightDimensions(
      codeToHighlight,
      <HTMLElement>codeWrapperElement
    );
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
  }*/
};

const addDiffListeners = (repo: Repository, filesInformation: FileInformation[]) => {
  const diffContainers = Array.from(
    document.querySelectorAll(".diff-table:not([detected=true])")
  ).map((element) => <HTMLElement>element);
  diffContainers.forEach(addLogicToDiffElements(repo, filesInformation));
};

const addLogicToDiffElements = (repo: Repository, filesInformation: FileInformation[]) => (diffContainer: HTMLElement) => {
  diffContainer.setAttribute("detected", `${true}`);

  diffContainer?.setAttribute(
    CODIGA_ELEMENT_ID_KEY,
    JSON.stringify(getPos(<HTMLElement>diffContainer))
  );

  const codigaExtensionElement = <CodigaExtension>(
    document.createElement("codiga-extension")
  );
  codigaExtensionElement.style.cssText +=
    "position: absolute; top: 0px; left: 0px";
  diffContainer.insertBefore(codigaExtensionElement, diffContainer.firstChild);

  const codigaExtensionHighlightsElement = <CodigaExtensionHighLights>(
    document.createElement("codiga-extension-highlights")
  );
  codigaExtensionHighlightsElement.style.cssText +=
    "position: absolute; top: 0px; left: 0px";
  diffContainer?.insertBefore(
    codigaExtensionHighlightsElement,
    diffContainer.firstChild
  );
  
  const context = {     
    codigaExtensionElement,
    codigaExtensionHighlightsElement,
    diffContainer,
    repo,
    filesInformation
  };

  startAnalysis(context);
  window.addEventListener("resize", () => {
    assignSize(codigaExtensionElement, diffContainer);
  });
};

const getBlobFromSha = async (repo: Repository, sha: string) => {
  return await repo.getBlob(sha);
}