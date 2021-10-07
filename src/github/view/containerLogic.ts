import { pickLanguage } from "../../pickLanguage";
import { pickFilename } from "../pickFilename";
import CodigaExtension from "../../customelements/CodigaExtension";
import CodigaExtensionHighLights from "../../customelements/CodigaExtensionHighlights";
import { assignSize, getDimensions, getPos } from "../../utils";
import { CODIGA_ELEMENT_ID_KEY, ContainerElement } from "../../containerElement";
import { runCodeValidation } from "../content_script";
import CodigaHighlight from "../../customelements/CodigaHighlight";
import { addTooltipToHighlight } from "../../content_scripts_common";

type CodeEventContext = {
  codigaExtensionElement: CodigaExtension;
  codigaExtensionHighlightsElement: CodigaExtensionHighLights;
  codeBoxContainer: HTMLElement;
  containerElement: ContainerElement;
};

const startAnalysis = (codeEventContext: CodeEventContext) => {
  const {
    codigaExtensionElement,
    codigaExtensionHighlightsElement,
    codeBoxContainer,
    containerElement,
  } = codeEventContext;

  assignSize(codigaExtensionHighlightsElement, codeBoxContainer);
  assignSize(codigaExtensionElement, containerElement.container);

  const code = getCodeFromTable(codeBoxContainer);
  const filename = pickFilename();
  const language = pickLanguage(filename);

  if (language && filename) {
    const codigaContext = {
      code,
      language,
      codigaExtensionHighlightsElement,
      codigaExtensionElement,
      filename,
      scrollContainer: codeBoxContainer,
      codeElement: codeBoxContainer,
    };

    runCodeValidation(codigaContext);
  }
};

export const addHiglightToViewViolation = (
  violation: Violation,
  codigaExtensionHighlightsElement: CodigaExtensionHighLights,
  codeElement: HTMLElement
) => {
  console.log("hereeeeee");
  const line = violation.line;
  const lineToHighlight = Array.from(codeElement.querySelectorAll("tr")).find(
    (child) => {
      return (
        child.querySelector(".blob-num")?.getAttribute("data-line-number") ===
        `${line}`
      );
    }
  );
  if (!lineToHighlight) return;

  const codeToHighlight = lineToHighlight.querySelector(".blob-code");
  if (
    codeToHighlight &&
    codeToHighlight.firstChild &&
    codeToHighlight.lastChild
  ) {
    const firstChild = <HTMLElement>codeToHighlight.firstChild;
    const highlightPosition = getPos(firstChild);

    const lastChild = <HTMLElement>codeToHighlight.lastChild;
    const lastChildPositionX = getPos(lastChild).x;
    const lastChildWidth = getDimensions(lastChild).width;
    const rightBound = lastChildPositionX + lastChildWidth;
    const highlightWidth = rightBound - highlightPosition.x;

    const highlightHeight = getDimensions(firstChild).height;
    const highlightsWrapperPosition = getPos(codigaExtensionHighlightsElement);
    const codigaHighlight = <CodigaHighlight>(
      document.createElement("codiga-highlight")
    );

    codigaHighlight.classList.add("codiga-highlight");

    codigaHighlight.top = highlightPosition.y - highlightsWrapperPosition.y;
    codigaHighlight.left = highlightPosition.x - highlightsWrapperPosition.x;

    codigaHighlight.width = highlightWidth;
    codigaHighlight.height = highlightHeight;

    const createdElements = addTooltipToHighlight(codigaHighlight, violation);

    codigaExtensionHighlightsElement.shadowRoot.appendChild(codigaHighlight);

    createdElements.forEach((createdElement) => {
      codigaExtensionHighlightsElement.shadowRoot.appendChild(createdElement);
    });
  }
};

export const addLogicToCodeBoxInstance = (
  codeBox: HTMLElement,
  topOffset: number,
  containerElement: ContainerElement
) => {
  // Without header we cannot set the position of highlights nor loading indicator correctly
  codeBox.setAttribute("detected", `${true}`);
  const codeBoxContainer = <HTMLElement>codeBox.querySelector("tbody");
  codeBoxContainer.setAttribute(
    CODIGA_ELEMENT_ID_KEY,
    JSON.stringify(getPos(codeBoxContainer))
  );

  const codigaExtensionElement = <CodigaExtension>(
    document.createElement("codiga-extension")
  );
  codigaExtensionElement.style.cssText += `position: absolute; top: ${topOffset}px; left: 0px`;
  containerElement.container.insertBefore(
    codigaExtensionElement,
    containerElement.container.firstChild
  );

  const codigaExtensionHighlightsElement = <CodigaExtensionHighLights>(
    document.createElement("codiga-extension-highlights")
  );
  codigaExtensionHighlightsElement.style.cssText += `position: absolute; top: ${topOffset}px; left: 0px`;
  codeBoxContainer.insertBefore(
    codigaExtensionHighlightsElement,
    codeBoxContainer.firstChild
  );

  const context = {
    codigaExtensionElement,
    codigaExtensionHighlightsElement,
    codeBoxContainer,
    containerElement,
  };

  startAnalysis(context);

  window.addEventListener("resize", () => {
    assignSize(codigaExtensionElement, containerElement.container);
  });
};

const getCodeFromTable = (codeBox: HTMLElement) => {
  return Array.from(codeBox.querySelectorAll("tr"))
    .map((tr) => {
      return tr
        .querySelector(".blob-code")
        ?.textContent?.replace(/\u200B/g, "")
        .replace("\n", "");
    })
    .join("\n");
};
