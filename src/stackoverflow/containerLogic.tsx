import ReactDOM from "react-dom";
import React from "react";
import {
  CODE_MIRROR_CLASS,
  STACK_OVERFLOW_CODE_CLASS,
} from "../constants";
import RecipeCreateForm from "./components/RecipeCreate";
import { pickLanguage } from "./pickLanguage";

const NOT_DETECTED_SEARCH_BAR_SELECTOR =
  ":not([detectedCodeFunctionalities=true])";
export const addSearchLogicToCodeBlock = () => {
  const codeBlockList = Array.from(
    Array.from(
      document.querySelectorAll(
        `${CODE_MIRROR_CLASS}${NOT_DETECTED_SEARCH_BAR_SELECTOR}`
      )
    ).concat(
      Array.from(
        document.querySelectorAll(
          `${STACK_OVERFLOW_CODE_CLASS}${NOT_DETECTED_SEARCH_BAR_SELECTOR}`
        )
      )
    )
  ).map((element) => element as HTMLElement);
  codeBlockList.forEach(addSearchBarToCodeBlockInstance);
};

export const addSearchBarToCodeBlockInstance = (codeBlock: HTMLElement) => {
  codeBlock.setAttribute("detectedCodeFunctionalities", `${true}`);

  const searchBarElement = document.createElement("div");

  codeBlock.parentElement.insertBefore(searchBarElement, codeBlock);
  const language = pickLanguage(codeBlock.getAttribute('class'));
  ReactDOM.render(<RecipeCreateForm code={getCodeFromBlock(codeBlock)} language={language} />, searchBarElement);
};

export const getCodeFromBlock = (codeBlock: HTMLElement): string => {
  return Array.from(codeBlock.children)
    .map((lineElement) => {
      return lineElement.textContent.replace(/\u200B/g, "");
    })
    .join("\n");
};
