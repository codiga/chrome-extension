import {
  addHighlights,
  runCodeValidation,
} from "../content_script";
import { addTooltipToHighlight, CodeInformation, getHighlightDimensions, getStatusButton, updateStatusButton } from "../../content_scripts_common";
import CodigaElement from "../../customelements/CodigaElement";
import CodigaExtension from "../../customelements/CodigaExtension";
import CodigaExtensionHighLights from "../../customelements/CodigaExtensionHighlights";
import CodigaHighlight from "../../customelements/CodigaHighlight";
import { assignSize, getDimensions, getPos, resetComponentShadowDOM } from "../../utils";
import { CODIGA_ELEMENT_ID_KEY } from "../../containerElement";

import { pickFilename } from "./pickFilename";
import { pickLanguage } from "../../pickLanguage";

import { Repository } from "github-api/dist/components/Repository";
import parseDiff from "parse-diff";
import { CodigaStatus } from "../../customelements/CodigaStatus";

type FileInformation = {sha: string, filename: string}

type CodeEventContext = {
  codigaExtensionElement: CodigaExtension;
  codigaExtensionHighlightsElement: CodigaExtensionHighLights;
  diffContainer: HTMLElement;
  repo: Repository;
  filesInformation: FileInformation[],
  diffInformation: parseDiff.File[]
};

export const detectDiffInstances = (repo: any, filesInformation: FileInformation[], diffInformation: parseDiff.File[]) => (
  mutationsList: { type: string }[]
) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      addDiffListeners(repo, filesInformation, diffInformation);
    }
  }
};

const startAnalysis = async (codeEventContext: CodeEventContext) => {
  const {
    codigaExtensionElement,
    codigaExtensionHighlightsElement,
    diffContainer,
    repo,
    filesInformation,
    diffInformation
  } = codeEventContext;

  assignSize(codigaExtensionHighlightsElement, diffContainer);
  assignSize(codigaExtensionElement, diffContainer);

  const filename = pickFilename(diffContainer);
  const language = pickLanguage(filename);
  const file = filesInformation.find(file => file.filename === filename);
  const diffFile = diffInformation.find(file => file.from === filename);

  const codeResponse = await getBlobFromSha(repo, file.sha);
  const code = codeResponse.data;

  if (language && filename) {
    const codeInformation = {
      code,
      language,
      codigaExtensionHighlightsElement,
      codigaExtensionElement,
      codeElement: diffContainer,
      filename,
      scrollContainer: diffContainer,
    };

    runDiffViolation(codeInformation, codeEventContext, diffFile);
  }
};

const runDiffViolation = (codeInformation: CodeInformation, codeContext: CodeEventContext, diffFile: parseDiff.File) => {
  const statusButton = getStatusButton(codeInformation.codigaExtensionElement);
  statusButton.status = CodigaStatus.LOADING;

  resetComponentShadowDOM(codeInformation.codigaExtensionHighlightsElement);

  chrome.runtime.sendMessage(
    {
      contentScriptQuery: "validateCode",
      data: {
        code: codeInformation.code,
        language: codeInformation.language,
        filename: codeInformation.filename,
        id: codeInformation.codeElement.getAttribute(CODIGA_ELEMENT_ID_KEY),
      },
    },
    (result) => {
      const addedLines = 
          diffFile.chunks
            .flatMap(chunk => chunk.changes.filter(change => change.type === 'add')
            .map(change => (<parseDiff.AddChange>change).ln));

      const violations = result.violations.filter(violation => addedLines.includes(Number(violation.line)));
      console.log("vilations: ", violations)
      if (!result || !violations || !violations.length) {
        statusButton.status = CodigaStatus.ALL_GOOD;
      } else {
        addHighlights(
          codeContext.codigaExtensionHighlightsElement,
          violations,
          codeInformation.codeElement
        );

        updateStatusButton(statusButton, result.violations);
      }
    }
  );
}

export const addHiglightToPullViolation = (
  violation: Violation,
  codigaExtensionHighlightsElement: CodigaElement,
  codeElement: HTMLElement
) => {
  const line = violation.line;
  console.log(codeElement, violation);
  const lineToHighlight = <HTMLElement> Array.from(codeElement.querySelectorAll('.blob-num')).find((blubNum) => {
    return (
      blubNum.getAttribute('data-line-number') ===
      `${line}`
    );
  }).parentElement.querySelector('.blob-code-inner');

  if (!lineToHighlight) return;

  const highlightPosition = getPos(lineToHighlight);
  const highlightDimensions = getDimensions(lineToHighlight);
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

export const addDiffListeners = (repo: Repository, filesInformation: FileInformation[], diffInformation: parseDiff.File[]) => {
  const diffContainers = Array.from(
    document.querySelectorAll(".diff-table:not([detected=true])")
  ).map((element) => <HTMLElement>element);
  diffContainers.forEach(addLogicToDiffElements(repo, filesInformation, diffInformation));
};

const addLogicToDiffElements = (repo: Repository, filesInformation: FileInformation[], diffInformation: parseDiff.File[]) => (diffContainer: HTMLElement) => {
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
    filesInformation,
    diffInformation
  };

  startAnalysis(context);

  window.addEventListener("resize", () => {
    assignSize(codigaExtensionElement, diffContainer);
  });
};

const getBlobFromSha = async (repo: Repository, sha: string) => {
  return await repo.getBlob(sha);
}