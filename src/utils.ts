import { Dimensions, Position } from "./types";

const getBoudingClientRect = (el: HTMLElement) => {
  if (el && el.getBoundingClientRect()) {
    return el.getBoundingClientRect();
  }

  let range = document.createRange();
  range.selectNode(el);
  const rect = range.getBoundingClientRect();
  range.detach();
  return rect;
};

export const getPos = (el: HTMLElement): Position => {
  const rect = getBoudingClientRect(el);
  return { x: rect.left, y: rect.top };
};

export const getDimensions = (el: HTMLElement): Dimensions => {
  const rect = getBoudingClientRect(el);
  return { width: rect.width > 1 ? rect.width : 100, height: rect.height };
};

export const resetComponentShadowDOM = (element: HTMLElement) => {
  if (element.shadowRoot) {
    element.shadowRoot.innerHTML = "";
  }
};

export const resetComponent = (element: HTMLElement) => {
  element.innerHTML = "";
};

export const groupBy = (l: Array<unknown>, key: string) => {
  return l.reduce((acc, curr) => {
    (acc[curr[key]] = acc[curr[key]] || []).push(curr);
    return acc;
  }, {});
};

export const timeout = (prom: Promise<unknown>, time: number) =>
  Promise.race([prom, new Promise((_r, rej) => setTimeout(rej, time))]);

export const mutationsCallback =
  (callback: Function) => (mutationsList: { type: string }[]) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        callback();
      }
    }
  };

export const getDetectedSelector = (selector: string, isDetected = true) => {
  return `${selector}${
    isDetected ? "[detected=true]" : ":not([detected=true])"
  }`;
};
