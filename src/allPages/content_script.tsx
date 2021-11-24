import { ADD_CODE_VALIDATION, BASE_URL, CREATE_RECIPE_FROM_SELECTION } from "../constants";
import { mutationsCallback } from "../utils";
import { addSearchLogicToCodeMirror } from "./containerLogic";
const Buffer = require("buffer/").Buffer;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === CREATE_RECIPE_FROM_SELECTION) {
    const selectionText = window.getSelection().toString();
    const encodedRecipe = Buffer.from(selectionText).toString("base64");
    window.open(`${BASE_URL}/assistant/recipe/create?code=${encodeURIComponent(encodedRecipe)}`, '_blank');
  }

  /*if (request.action === ADD_CODE_VALIDATION) {
    const observer = new MutationObserver(mutationsCallback(addSearchLogicToCodeMirror));
    observer.observe(document, { childList: true, subtree: true });
  }*/
});

