import { CODIGA_HIGHLIGHT, CODIGA_POPUPS } from "./constants";
import { addTooltipToHighlight } from "./content_scripts_common";
import CodigaExtensionHighLights from "./customelements/CodigaExtensionHighlights";
import CodigaHighlight from "./customelements/CodigaHighlight";
import { Dimensions, Position, Violation } from "./types";
import { getPos } from "./utils";

export type LineRange = {
  startLine: number;
  endLine: number;
};

export const setUpHighlights = (
  codigaExtensionHighlightsElement: CodigaExtensionHighLights,
  codigaElementRef: string,
  highlightPosition: Position,
  highlightDimensions: Dimensions,
  violation: Violation
) => {
  const highlightsWrapperPosition = getPos(codigaExtensionHighlightsElement);
  const codigaHighlight = <CodigaHighlight>(
    document.createElement(CODIGA_HIGHLIGHT)
  );

  codigaHighlight.classList.add(CODIGA_HIGHLIGHT);

  codigaHighlight.top = highlightPosition.y - highlightsWrapperPosition.y;
  codigaHighlight.left = highlightPosition.x - highlightsWrapperPosition.x;

  codigaHighlight.width = highlightDimensions.width;
  codigaHighlight.height = highlightDimensions.height;

  const createdTooltipElements = addTooltipToHighlight(
    codigaHighlight,
    codigaElementRef,
    violation
  );

  codigaExtensionHighlightsElement.shadowRoot.appendChild(codigaHighlight);

  createdTooltipElements.forEach((createdElement) => {
    document.querySelector(CODIGA_POPUPS).appendChild(createdElement);
  });
};
