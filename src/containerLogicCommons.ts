import { addTooltipToHighlight } from "./content_scripts_common";
import CodigaExtensionHighLights from "./customelements/CodigaExtensionHighlights";
import CodigaHighlight from "./customelements/CodigaHighlight";
import { Dimensions, Position, Violation } from "./types";
import { getPos } from "./utils";

export const setUpHighlights = (
    codigaExtensionHighlightsElement: CodigaExtensionHighLights, 
    highlightPosition: Position, 
    highlightDimensions: Dimensions, 
    violation: Violation
) => {
    const highlightsWrapperPosition = getPos(codigaExtensionHighlightsElement);
    const codigaHighlight = <CodigaHighlight>(
        document.createElement("codiga-highlight")
    );

    codigaHighlight.classList.add("codiga-highlight");

    codigaHighlight.top = highlightPosition.y - highlightsWrapperPosition.y;
    codigaHighlight.left = highlightPosition.x - highlightsWrapperPosition.x;

    codigaHighlight.width = highlightDimensions.width;
    codigaHighlight.height = highlightDimensions.height;

    const createdTooltipElements = addTooltipToHighlight(codigaHighlight, violation);

    codigaExtensionHighlightsElement.shadowRoot.appendChild(codigaHighlight);
    
    
    createdTooltipElements.forEach((createdElement) => {
        document.querySelector("codiga-popups").appendChild(createdElement);
    });
}