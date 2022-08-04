import { Buffer } from "buffer";
import { BASE_URL, CREATE_RECIPE_FROM_SELECTION } from "../constants";

chrome.runtime.onMessage.addListener((request) => {
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
});
