import CodigaElement from "./customelements/CodigaElement";
import CodigaExtension from "./customelements/CodigaExtension";

import { getDimensions, getPos, resetComponentShadowDOM } from "./utils";
import { createPopper, Instance } from "@popperjs/core";
import CodigaExtensionHighLights from "./customelements/CodigaExtensionHighlights";
import CodigaStatusButton, {
  CodigaStatus,
} from "./customelements/CodigaStatus";

const PRETTY_CATEGORIES: Record<string, string> = {
    Code_Style: "Code style",
    Error_Prone: "Error prone",
    Documentation: "Documentation",
    Security: "Security",
    Design: "Design",
    Safety: "Safety",
    Best_Practice: "Best practice",
    Unknown: "Unknown",
  };
  import '@webcomponents/custom-elements';
  import CodigaHighlight from "./customelements/CodigaHighlight";
  
  
  let containerElement = getContainerElement();
  const config = { childList: true, subtree: true };
  
  type CodeInformation = {
    code: string;
    language: string;
    codigaExtensionHighlightsElement: any;
    codigaExtensionElement: any;
    codeElement: HTMLElement;
    filename: string;
    scrollContainer: HTMLElement;
  };
  
  export const runCodeValidation = (codeInformation: CodeInformation) => {
    const {
      code,
      language,
      codigaExtensionHighlightsElement,
      codigaExtensionElement,
      codeElement,
      filename,
      scrollContainer,
    } = codeInformation;
    const statusButton = getStatusButton(codigaExtensionElement);
    statusButton.status = CodigaStatus.LOADING;
  
    resetComponentShadowDOM(codigaExtensionHighlightsElement);
  
    chrome.runtime.sendMessage(
      {
        contentScriptQuery: "validateCode",
        data: {
          code,
          language,
          filename,
          id: codeElement.getAttribute(CODIGA_ELEMENT_ID_KEY),
        },
      },
      (result) => {
        if (!result || !result.violations || !result.violations.length) {
          statusButton.status = CodigaStatus.ALL_GOOD;
        } else {
          addHighlights(
            codigaExtensionHighlightsElement,
            result.violations,
            codeElement
          );
          updateStatusButton(statusButton, result.violations);
  
          // On scroll highlights should be updated
          let timer: NodeJS.Timeout;
          scrollContainer.addEventListener(
            "scroll",
            function () {
              resetComponentShadowDOM(codigaExtensionHighlightsElement);
  
              if (timer) {
                clearTimeout(timer);
              }
  
              timer = setTimeout(function () {
                updateStatusButton(statusButton, result.violations);
                addHighlights(
                  codigaExtensionHighlightsElement,
                  result.violations,
                  codeElement
                );
              }, 150);
            },
            false
          );
        }
      }
    );
  };
  