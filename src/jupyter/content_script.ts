import CodigaElement from "../customelements/CodigaElement";
import { mutationsCallback, resetComponentShadowDOM } from "../utils";
import { CodigaStatus } from "../customelements/CodigaStatus";
import {
  addCodeMirrorListeners,
  addHiglightToEditViolation,
} from "./containerLogic";
import "@webcomponents/custom-elements";

import {
  CodeInformation,
  createPopups,
  getStatusButton,
  removeTooltips,
  updateStatusButton,
} from "../content_scripts_common";
import "../content_scripts_common"; // For side effects
import {
  CODIGA_ELEMENT_ID_KEY,
  getContainerElement,
} from "../containerElement";
import { ValidateCodeResult, Violation } from "../types";
import { validateCode } from "../validateCode";
import { ADD_CODE_VALIDATION } from "../constants";
import { LineRange } from "../containerLogicCommons";

let containerElement = getContainerElement();

class CodeValidator {
  private promise: Promise<ValidateCodeResult>;
  private code = "";
  private static instance = undefined;

  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new CodeValidator();
    }
    return this.instance;
  }

  validateCodePromise = ({ code, language, filename, id }) => {
    if (code != this.code) {
      this.code = code;
      this.promise = validateCode({
        code,
        language,
        filename,
        id,
      });
    }

    return this.promise;
  };
}

export const runCodeValidation = async (
  codeInformation: CodeInformation,
  codeMirror: HTMLElement
) => {
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
  const elementRef = codeElement.getAttribute(CODIGA_ELEMENT_ID_KEY);
  removeTooltips(elementRef);

  const codeValidator = CodeValidator.getInstance();
  try {
    const result = await codeValidator.validateCodePromise({
      code,
      language,
      filename,
      id: elementRef,
    });

    const lineRange: LineRange = {
      startLine: Number(codeMirror.getAttribute("codiga-start")),
      endLine: Number(codeMirror.getAttribute("codiga-end")),
    };

    const checkViolationIsInRange = (violation: { line: number }) => {
      return (
        violation.line >= lineRange.startLine &&
        violation.line < lineRange.endLine
      );
    };

    const findViolationInRange = result.violations.find(
      checkViolationIsInRange
    );
    if (
      !result.violations ||
      !result.violations.length ||
      !findViolationInRange
    ) {
      statusButton.status = CodigaStatus.ALL_GOOD;
    } else {
      updateStatusButton(
        statusButton,
        result.violations.filter(checkViolationIsInRange)
      );
      addHighlights(
        codigaExtensionHighlightsElement,
        result.violations,
        codeElement,
        lineRange
      );

      // On scroll highlights should be updated
      let timer: NodeJS.Timeout;
      scrollContainer.addEventListener(
        "scroll",
        function () {
          resetComponentShadowDOM(codigaExtensionHighlightsElement);
          removeTooltips(elementRef);

          if (timer) {
            clearTimeout(timer);
          }

          timer = setTimeout(function () {
            updateStatusButton(
              statusButton,
              result.violations.filter(checkViolationIsInRange)
            );
            addHighlights(
              codigaExtensionHighlightsElement,
              result.violations,
              codeElement,
              lineRange
            );
          }, 150);
        },
        false
      );
    }
  } catch (e) {}
};

const addHighlights = (
  codigaExtensionHighlightsElement: CodigaElement,
  violations: Violation[],
  codeElement: HTMLElement,
  lineRange: LineRange
) => {
  resetComponentShadowDOM(codigaExtensionHighlightsElement);
  const elementRef = codeElement.getAttribute(CODIGA_ELEMENT_ID_KEY);
  removeTooltips(elementRef);

  const codigaHighlightsStyle = document.createElement("style");
  codigaHighlightsStyle.innerHTML = `
        .codiga-highlight {
            position: absolute;
            z-index: 3; 
        }

        /* Slide in */
        .codiga-highlight {
            overflow: hidden;
        }

        @keyframes slidein {
            from {
                transform: translate3d(-100%, 0, 0);
            }
            
            to {
                transform: translate3d(0, 0, 0);
            }
        }

        .codiga-highlight::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 0.1rem;
            background-color: #cc498b;
            opacity: 1;
            animation: slidein .2s;
        }
        
        .codiga-highlight:hover{
            background: #c1424282;
        }
    `;
  codigaExtensionHighlightsElement.shadowRoot.appendChild(
    codigaHighlightsStyle
  );

  violations.forEach((violation) => {
    addHiglightToEditViolation(
      violation,
      codigaExtensionHighlightsElement,
      codeElement,
      lineRange
    );
  });
};

const container = containerElement.container;
if (container) {
  const observer = new MutationObserver(
    mutationsCallback(addCodeMirrorListeners)
  );
  observer.observe(container, { childList: true, subtree: true });
}

// Start point
createPopups();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === ADD_CODE_VALIDATION) {
    containerElement = getContainerElement();
    const container = containerElement.container;
    if (container) {
      const observer = new MutationObserver(
        mutationsCallback(addCodeMirrorListeners)
      );
      observer.observe(container, { childList: true, subtree: true });
    }
  }
  sendResponse({ result: true });
});
