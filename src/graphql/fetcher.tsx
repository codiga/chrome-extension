import { v4 as uuidv4 } from "uuid";
import { createClient } from "@urql/core";
import { getRecipesByShortcut, getRecipesByShortcutLastTimestamp } from "./queries";
import { AssistantRecipe } from "../types";

const client = createClient({
  url: "https://api.codiga.io/graphql",
  requestPolicy: "cache-and-network",
});

const runningValidationsCache: Record<string, string> = {};
const STORAGE_FINGERPRINT_KEY = "codiga-user";

export const generateFingerprint = (): Promise<string> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get([STORAGE_FINGERPRINT_KEY], (result) => {
      if (
        !result ||
        (Object.keys(result).length === 0 && result.constructor === Object)
      ) {
        const fingerprint = uuidv4();
        chrome.storage.sync.set(
          { [STORAGE_FINGERPRINT_KEY]: fingerprint },
          () => {
            resolve(fingerprint);
          }
        );
      } else {
        resolve(result[STORAGE_FINGERPRINT_KEY]);
      }
    });
  });
};

export const getAssistantRecipesByShortcut = async (request: {
  language: string;
  shortcut?: string;
  id: string;
}): Promise<AssistantRecipe[]> => {
  const executionId = uuidv4();
  const fingerprint = await generateFingerprint();
  const language = request.language;
  const shortcut = request.shortcut;

  const codeElementId = request.id;
  runningValidationsCache[codeElementId] = executionId;


  const recipesByShortcut = await client
    .query(getRecipesByShortcut(fingerprint, shortcut?shortcut.slice(1):undefined, language))
    .toPromise();

  return recipesByShortcut.data.getRecipesForClientByShortcut.slice(0, 10);
};

export async function getRecipesForClientByShorcutLastTimestamp(
  language: string
): Promise<number | undefined> {
  // Convert array of parameters into k1=v1;k2=v2

  // Get the fingerprint from localstorage to initiate the request
  const userFingerprint = await generateFingerprint();

  const lastTimestamp = await client
  .query(getRecipesByShortcutLastTimestamp(userFingerprint, language))
  .toPromise();

  if (!lastTimestamp) {
    return undefined;
  }

  return lastTimestamp.data.getRecipesForClientByShortcutLastTimestamp;
}