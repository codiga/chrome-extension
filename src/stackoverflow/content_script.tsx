import { ADD_CODE_VALIDATION, BASE_URL, CREATE_RECIPE_FROM_SELECTION } from "../constants";
import { mutationsCallback } from "../utils";
import { addSearchLogicToCodeBlock } from "./containerLogic";

addSearchLogicToCodeBlock();
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === ADD_CODE_VALIDATION) {
    const observer = new MutationObserver(mutationsCallback(addSearchLogicToCodeBlock));
    observer.observe(document, { childList: true, subtree: true });
  }
});

