/**
 * Specific logic for the Pull Requests file change pages in GitHub
 */
import {
  addHighlights
} from "../content_script";
import { CodeInformation, getStatusButton, updateStatusButton } from "../../content_scripts_common";
import CodigaElement from "../../customelements/CodigaElement";
import CodigaExtension from "../../customelements/CodigaExtension";
import CodigaExtensionHighLights from "../../customelements/CodigaExtensionHighlights";
import { assignSize, getDimensions, getPos, resetComponentShadowDOM } from "../../utils";
import { CODIGA_ELEMENT_ID_KEY } from "../../containerElement";

import { pickFilename } from "./pickFilename";
import { pickLanguage } from "../../pickLanguage";

import { Repository } from "github-api/dist/components/Repository";
import parseDiff from "parse-diff";
import { CodigaStatus } from "../../customelements/CodigaStatus";
import { Violation } from "../../types";
import { validateCode } from "../../validateCode";
import { setUpHighlights } from "../../containerLogicCommons";
import { BLOB_CODE_INNER } from "../../constants";

// File structure retrieved by GitHub API
type FileInformation = {sha: string, filename: string}

/**
 * Required context information (HTML components reference, github repository client, files information)
 * for running the code validation
 */
type CodeEventContext = {
  codigaExtensionElement: CodigaExtension;
  codigaExtensionHighlightsElement: CodigaExtensionHighLights;
  diffContainer: HTMLElement;
  repo: Repository;
  filesInformation: FileInformation[],
  diffInformation: parseDiff.File[]
};

/**
 * Detects HTML changes in code container (e.g new code blocks added to the DOM) and adds a Codiga Listener
 */
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
  const diffFile = diffInformation.find(file => file.to === filename);
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

const runDiffViolation = async (codeInformation: CodeInformation, codeContext: CodeEventContext, diffFile: parseDiff.File) => {
  const statusButton = getStatusButton(codeInformation.codigaExtensionElement);
  statusButton.status = CodigaStatus.LOADING;

  resetComponentShadowDOM(codeInformation.codigaExtensionHighlightsElement);

  const result = await validateCode({
    code: codeInformation.code,
    language: codeInformation.language,
    filename: codeInformation.filename,
    id: codeInformation.codeElement.getAttribute(CODIGA_ELEMENT_ID_KEY),
  });

  const addedLines = 
    diffFile.chunks
      .flatMap(chunk => chunk.changes.filter(change => change.type === 'add')
      .map(change => (<parseDiff.AddChange>change).ln));

  const violations = result.violations.filter(violation => addedLines.includes(Number(violation.line)));
  
  if (!result || !violations || !violations.length) {
    statusButton.status = CodigaStatus.ALL_GOOD;
  } else {
    addHighlights(
      codeContext.codigaExtensionHighlightsElement,
      violations,
      codeInformation.codeElement
    );

    updateStatusButton(statusButton, violations);
  }
}

export const addHiglightToPullViolation = (
  violation: Violation,
  codigaExtensionHighlightsElement: CodigaElement,
  codeElement: HTMLElement
) => {
  const line = violation.line;
  const lineToHighlight = <HTMLElement> Array.from(codeElement.querySelectorAll('.blob-num')).find((blubNum) => {
    return (
      blubNum.getAttribute('data-line-number') ===
      `${line}`
    );
  }).parentElement.querySelector(BLOB_CODE_INNER);

  if (!lineToHighlight) return;

  const highlightPosition = getPos(lineToHighlight);
  const highlightDimensions = getDimensions(lineToHighlight);
  const elementRef = codeElement.getAttribute(CODIGA_ELEMENT_ID_KEY);

  setUpHighlights(codigaExtensionHighlightsElement, elementRef, highlightPosition, highlightDimensions, violation);
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
