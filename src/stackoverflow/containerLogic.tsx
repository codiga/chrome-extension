import ReactDOM from "react-dom";
import React from "react";
import { CODE_MIRROR_CLASS, STACK_OVERFLOW_CODE_CLASS } from "../constants";
import RecipeCreateButton from "./components/RecipeCreateButton";
import { pickLanguage } from "./pickLanguage";

const NOT_DETECTED_CREATE_BUTTON_SELECTOR =
  ":not([detectedCodeFunctionalities=true])";
export const addCreateLogicToCodeBlock = () => {
  const codeBlockList = Array.from(
    Array.from(
      document.querySelectorAll(
        `${CODE_MIRROR_CLASS}${NOT_DETECTED_CREATE_BUTTON_SELECTOR}`,
      ),
    ).concat(
      Array.from(
        document.querySelectorAll(
          `${STACK_OVERFLOW_CODE_CLASS}${NOT_DETECTED_CREATE_BUTTON_SELECTOR}`,
        ),
      ),
    ),
  ).map((element) => element as HTMLElement);
  codeBlockList.forEach(addCreateRecipeToCodeBlockInstance);
};

export const addCreateRecipeToCodeBlockInstance = (codeBlock: HTMLElement) => {
  codeBlock.setAttribute("detectedCodeFunctionalities", `${true}`);

  const searchBarElement = document.createElement("div");

  codeBlock.parentElement.insertBefore(searchBarElement, codeBlock);
  const language = pickLanguage(codeBlock.getAttribute("class"));
  const isDarkMode = ![undefined, null].includes(
    document.querySelector(".theme-dark"),
  );
  const keywords = Array.from(document.querySelectorAll(".post-tag"))
    .map((element) => element.textContent)
    .filter((keyword) => keyword.length);

  ReactDOM.render(
    <RecipeCreateButton
      code={getCodeFromBlock(codeBlock)}
      language={language}
      keywords={keywords}
      isDarkMode={isDarkMode}
    />,
    searchBarElement,
  );
};

export const getCodeFromBlock = (codeBlock: HTMLElement): string => {
  return Array.from(codeBlock.children)
    .map((lineElement) => {
      return lineElement.textContent.replace(/\u200B/g, "");
    })
    .join("\n");
};
