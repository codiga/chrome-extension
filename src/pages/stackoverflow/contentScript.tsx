import { Buffer } from "buffer";
import {
  ADD_RECIPE_CREATION,
  BASE_URL,
  CREATE_RECIPE_FROM_SELECTION,
} from "../../lib/constants";
import { mutationsCallback } from "../../lib/utils";
import { addCreateLogicToCodeBlock } from "./containerLogic";

addCreateLogicToCodeBlock();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === CREATE_RECIPE_FROM_SELECTION) {
    const selectionText = window.getSelection().toString();
    const encodedRecipe = Buffer.from(selectionText).toString("base64");
    window.open(
      `${BASE_URL}/assistant/snippet/create?code=${encodeURIComponent(
        encodedRecipe,
      )}`,
      "_blank",
    );
  }

  if (request.action === ADD_RECIPE_CREATION) {
    const observer = new MutationObserver(
      mutationsCallback(addCreateLogicToCodeBlock),
    );
    observer.observe(document, { childList: true, subtree: true });
  }
});
