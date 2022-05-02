import {
  CODING_ASSISTANT_MAX_TIME_IN_CACHE_MS,
  CODING_ASSISTANT_SHORTCUTS_POLLING_MS,
} from "../constants";
import {
  getAssistantRecipesByShortcut,
  getRecipesForClientByShorcutLastTimestamp,
} from "../graphql/fetcher";
import { AssistantRecipe } from "../types";
import { CODIGA_ELEMENT_ID_KEY } from "./containerLogic";
import { pickCodeElement, pickLanguage } from "./picker";

let enablePeriodicPolling = true;

/**
 * Interface for cache key and cache values
 */
export interface ShortcutCacheKey {
  language: string;
  filename: string | undefined;
  dependencies: string[];
}

export interface ShortcutCacheValue {
  lastUpdateTimestampMs: number;
  lastAccessTimestampMs: number;
  values: AssistantRecipe[];
}

/**
 * The actual cache: a map that indexed by key/values
 */
const cache: Map<string, ShortcutCacheValue> = new Map();

/**
 * Function that is used by the completion to get all shortcuts
 * for a particular context. This is called by assistant-completion.ts.
 *
 * TODO: Language should be a type
 *
 * @param filename
 * @param language
 * @param dependencies
 * @returns
 */
export const getShortcutCache = (
  filename: string | undefined,
  language: string,
  dependencies: string[]
): AssistantRecipe[] | undefined => {
  const cacheKey = {
    language,
    filename,
    dependencies,
  };
  const cacheKeyString = JSON.stringify(cacheKey);
  const cacheValue = cache.get(cacheKeyString);
  if (!cacheValue) {
    return undefined;
  } else {
    return cacheValue.values;
  }
};

/**
 * Disable polling. Set when the plugin is deactivated.
 */
export const disableShortcutsPolling = () => {
  enablePeriodicPolling = false;
};

/**
 * Enable shortcut polling. Set at startup.
 */
export const enableShortcutsPolling = () => {
  enablePeriodicPolling = true;
};

export const garbageCollection = (
  cacheToCollect: Map<string, ShortcutCacheValue>
) => {
  const nowMs = Date.now();
  const keysToCollect = [];

  /**
   * First, look at the keys we need to collect/remove
   * from the cache.
   */
  for (const key of Array.from(cacheToCollect.keys())) {
    const cacheValue = cacheToCollect.get(key);
    if (cacheToCollect.has(key) && cacheValue) {
      /**
       * Was the data in the cache long enough?
       */
      if (
        cacheValue.lastAccessTimestampMs <
        nowMs - CODING_ASSISTANT_MAX_TIME_IN_CACHE_MS
      ) {
        keysToCollect.push(key);
      }
    }
  }

  /**
   * Remove the data from the cache.
   */
  keysToCollect.forEach((key) => {
    cacheToCollect.delete(key);
  });
};

/**
 * Fetch all shortcuts. This function is periodically
 * called using polling.
 * @param codeElementId: id of the codeElement where the code is written
 * @returns
 */
export const fetchShortcuts = async () => {
  // TODO: Complete this when reading dependencies
  const dependencies: string[] = [];
  // TODO: Complete this when
  const relativePath = "";
  const language: string = pickLanguage();

  const cacheKey: ShortcutCacheKey = {
    language: language,
    filename: relativePath,
    dependencies: dependencies,
  };

  const lastTimestamp = await getRecipesForClientByShorcutLastTimestamp(
    language,
    dependencies
  );

  /**
   * There is no recipe for this key, just leave this function
   */
  if (!lastTimestamp) {
    return;
  }

  const nowTimestampMs = Date.now();

  /**
   * We should fetch if and only if
   *  - there was no data before
   *  - there are new recipes available by shortcut
   */
  const cacheKeyString = JSON.stringify(cacheKey);
  const shouldFetch =
    !cache.has(cacheKeyString) ||
    cache.get(cacheKeyString)?.lastUpdateTimestampMs !== lastTimestamp;

  /**
   * If we should not fetch and there is data in the cache,
   * update the last access time so that the data is not marked
   * to be garbage collected.
   */
  if (!shouldFetch && cache.has(cacheKeyString)) {
    const currentValue = cache.get(cacheKeyString);
    if (currentValue) {
      currentValue.lastAccessTimestampMs = nowTimestampMs;
      cache.set(cacheKeyString, currentValue);
    }
  }

  if (shouldFetch) {
    const recipes = await getAssistantRecipesByShortcut({
      language,
      shortcut: undefined,
      id: pickCodeElement().getAttribute(CODIGA_ELEMENT_ID_KEY),
    });

    // associated the new timestamp with the cache value
    const cacheValue: ShortcutCacheValue = {
      lastUpdateTimestampMs: lastTimestamp,
      lastAccessTimestampMs: nowTimestampMs,
      values: recipes,
    };

    // need to stringify since we take a string as a key
    const newCacheKey = JSON.stringify(cacheKey);
    cache.set(newCacheKey, cacheValue);
  }
};

/**
 * Until periodic polling is enable, execute
 * the polling function and wait for the next
 * execution.
 */
export const fetchPeriodicShortcuts = async () => {
  if (enablePeriodicPolling) {
    await fetchShortcuts().catch((e) => {
      console.error("error while fetching shortcuts");
    });
    garbageCollection(cache);
    setTimeout(fetchPeriodicShortcuts, CODING_ASSISTANT_SHORTCUTS_POLLING_MS);
  }
};
