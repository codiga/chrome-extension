import ShortcutDropdown from "../components/ShortcutDropdown";
import {
  CODE_MIRROR_LINE_CLASS,
  CODIGA_END,
  CODIGA_START,
  REPLIT_EDITOR_ACTIVE_LINE,
  REPLIT_EDITOR_CLASS,
  REPLIT_EDITOR_CONTENT,
  REPLIT_EDITOR_CURSOR,
  REPLIT_EDITOR_SCROLL,
} from "../constants";
import { getAssistantRecipesByShortcut } from "../graphql/fetcher";
import { AssistantRecipe } from "../types";
import { getDetectedSelector, getDimensions, getPos } from "../utils";
import {
  pickCodeElement,
  pickCodeElementId,
  pickFilename,
  pickLanguage,
} from "./picker";
import {
  enableShortcutsPolling,
  fetchPeriodicShortcuts,
  getShortcutCache,
} from "./shortcutCache";
import * as ReactDOM from "react-dom/client";
import React from "react";
import CodigaDrawer from "../components/panel/Drawer";

export const CODIGA_ELEMENT_ID_KEY = "codiga-id";
export let cacheCode = "";

let currentFile = undefined;

export const addCodeMirrorListeners = () => {
  const codeMirrorList = Array.from(
    document.querySelectorAll(getDetectedSelector(REPLIT_EDITOR_CLASS, false))
  )
    .concat(
      Array.from(
        document.querySelectorAll(
          getDetectedSelector(REPLIT_EDITOR_CLASS, false)
        )
      )
    )
    .map((element) => element as HTMLElement);
  codeMirrorList.forEach(addLogicToCodeMirrorInstance);
};

type CodeEventContext = {
  codeElement: HTMLElement;
  cursor: HTMLElement;
  shortcutDropdownElement: ShortcutDropdown;
  codeMirror: HTMLElement;
  scrollerElement: HTMLElement;
  language: string;
};

/**
 * Get the recipes. We first attempt to get them from the cache if there
 * is anything in the cache. Otherwise, we get them by making an API
 * query.
 *
 * @param term - the search term
 * @param filename - the filename we are looking for
 * @param language - the language we are using
 * @param dependencies - list of dependencies
 * @returns
 */
const getRecipes = async (
  term: string | undefined,
  dependencies: string[] = []
): Promise<AssistantRecipe[]> => {
  const recipesFromCache = getShortcutCache(
    pickFilename(),
    pickLanguage(),
    dependencies
  );

  /**
   * If we find recipes from the cache, get them and filter
   * using the one that start with the given term.
   * Otherwise, we fetch using the API.
   */
  if (recipesFromCache) {
    return recipesFromCache.filter((r) => {
      if (term) {
        return r.shortcut && r.shortcut.startsWith(term.slice(1).toLowerCase());
      } else {
        return r.shortcut !== null;
      }
    });
  } else {
    return await getAssistantRecipesByShortcut({
      language: pickLanguage(),
      shortcut: term,
      id: pickCodeElementId(),
    });
  }
};

const eventListenerCallback = async (codeEventContext: CodeEventContext) => {
  const { codeElement, shortcutDropdownElement } = codeEventContext;

  const activeLineCode = getCodeFromActiveLine(codeElement);
  const code = getCodeFromCodeElement(codeElement);

  if (activeLineCode != cacheCode) {
    cacheCode = activeLineCode;

    const shortcutMatch = activeLineCode.match(/(\.([a-zA-Z]*))*/);
    const activeLineIndex = Array.from(codeElement.children).findIndex((el) => {
      return el.classList.contains(REPLIT_EDITOR_ACTIVE_LINE.slice(1));
    });

    if (
      activeLineCode.length &&
      shortcutMatch &&
      shortcutMatch.length &&
      shortcutMatch[0].length === activeLineCode.length
    ) {
      setTimeout(() => {
        if (activeLineCode === cacheCode) {
          getRecipes(activeLineCode)
            .then((assistantRecipes) => {
              shortcutDropdownElement.context = {
                recipes: assistantRecipes,
                code,
                activeLineIndex,
              };
            })
            .catch(() => {
              shortcutDropdownElement.context = {
                recipes: [],
                code,
                activeLineIndex,
              };
            });
        }
      }, 500);
    } else {
      shortcutDropdownElement.context = {
        recipes: [],
        code,
        activeLineIndex,
      };
    }
  }
};

// This function sets the lines of the document as a whole for a specific CodeMirror
// instance as attributes to the CodeMirror element.
const setCodeMirrorLinesRange = () => {
  const detectedCodeMirrorInstances = Array.from(
    document.querySelectorAll(getDetectedSelector(REPLIT_EDITOR_CONTENT))
  ).map((element) => element as HTMLElement);

  detectedCodeMirrorInstances.reduce((acc, cm) => {
    cm.setAttribute(CODIGA_START, `${acc}`);
    const codeMirrorLines = cm.querySelectorAll(CODE_MIRROR_LINE_CLASS).length;
    cm.setAttribute(CODIGA_END, `${acc + codeMirrorLines}`);
    return acc + codeMirrorLines;
  }, 1);
};

export const addLogicToCodeMirrorInstance = (codeMirror: HTMLElement) => {
  codeMirror.setAttribute("detected", "true");

  const style = document.createElement("style");
  style.innerHTML = `
        codiga-shortcut-dropdown {
          position: absolute;
          background: inherit;
          opacity: 0.8
          padding: 0.3;
          font-size: 1rem;
        }
    `;
  document.head.appendChild(style);

  const shortcutDropdownElement = document.createElement(
    "codiga-shortcut-dropdown"
  ) as ShortcutDropdown;
  codeMirror.appendChild(shortcutDropdownElement);

  const codeElement = pickCodeElement();

  const scrollerElement = codeMirror.querySelector(
    REPLIT_EDITOR_SCROLL
  ) as HTMLElement;

  codeElement?.setAttribute(
    CODIGA_ELEMENT_ID_KEY,
    JSON.stringify(getPos(codeElement))
  );

  const onCodeElementChange = () => {
    setCodeMirrorLinesRange();

    const cursor = document.querySelector(REPLIT_EDITOR_CURSOR) as HTMLElement;

    const activeLine = document.querySelector(
      REPLIT_EDITOR_ACTIVE_LINE
    ) as HTMLElement;

    const context = {
      codeMirror,
      codeElement,
      cursor,
      shortcutDropdownElement,
      scrollerElement,
      language: pickLanguage(),
    };

    const cursorPosition = getPos(cursor);
    const codeElementPosition = getPos(codeElement);
    const scrollerPosition = getPos(scrollerElement);
    const activeLineDimensions = getDimensions(activeLine);

    if (cursor && scrollerElement && codeElement) {
      shortcutDropdownElement.top =
        cursorPosition.y - scrollerPosition.y + activeLineDimensions.height;

      if (codeElement && codeElementPosition)
        shortcutDropdownElement.left =
          cursorPosition.x - codeElementPosition.x - codeElement.offsetTop;

      if (pickFilename() != currentFile) {
        currentFile = pickFilename();
        enableShortcutsPolling();
        fetchPeriodicShortcuts(currentFile);
      }
      eventListenerCallback(context);
    }
  };

  if (codeElement) {
    const observer = new MutationObserver(onCodeElementChange);

    observer.observe(codeElement, {
      subtree: true,
      childList: true,
      characterData: true,
    });
  }
};

// get all code from a give CodeMirror instance
const getCodeFromCodeElement = (codeElement: HTMLElement): string => {
  return Array.from(codeElement.children)
    .map((lineElement) => {
      return lineElement.textContent.replace(/\u200B/g, "");
    })
    .join("\n");
};

// get all code from a give CodeMirror instance in the active line
const getCodeFromActiveLine = (codeElement: HTMLElement): string => {
  return Array.from(codeElement.children)
    .find((el) => el.classList.contains("cm-activeLine"))
    .textContent.replace(/\u200B/g, "");
};

/**
 * Panel for looking for snippets easily from Replit
 */
export const addCodigaPanel = (container: HTMLElement) => {
  const mountPoint = document.createElement("div");
  const root = ReactDOM.createRoot(mountPoint);
  root.render(<CodigaDrawer />);

  container.append(mountPoint);
};
