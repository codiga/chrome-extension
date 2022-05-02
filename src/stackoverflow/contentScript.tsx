import { ADD_RECIPE_CREATION, BASE_URL, CREATE_RECIPE_FROM_SELECTION } from "../constants";
import { mutationsCallback } from "../utils";
import { addCreateLogicToCodeBlock } from "./containerLogic";
const Buffer = require("buffer/").Buffer;

addCreateLogicToCodeBlock();
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === CREATE_RECIPE_FROM_SELECTION) {
    const selectionText = window.getSelection().toString();
    const encodedRecipe = Buffer.from(selectionText).toString("base64");
    window.open(`${BASE_URL}/assistant/recipe/create?code=${encodeURIComponent(encodedRecipe)}`, '_blank');
  }

  if (request.action === ADD_RECIPE_CREATION) {
    const observer = new MutationObserver(mutationsCallback(addCreateLogicToCodeBlock));
    observer.observe(document, { childList: true, subtree: true });
  }
});