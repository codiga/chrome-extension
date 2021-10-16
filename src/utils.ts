import CodigaElement from "./customelements/CodigaElement";
import { Dimensions, Position } from "./types";

const getBoudingClientRect = (el: HTMLElement) => {
  let rect;
  if (el["getBoundingClientRect"]) {
    rect = el.getBoundingClientRect();
  } else {
    var range = document.createRange();
    range.selectNode(el);
    rect = range.getBoundingClientRect();
    range.detach();
  }

  return rect;
};

export const getPos = (el: HTMLElement): Position => {
  const rect = getBoudingClientRect(el);
  return { x: rect.left, y: rect.top };
};

export const getDimensions = (el: HTMLElement): Dimensions => {
  let rect = getBoudingClientRect(el);
  return { width: rect.width, height: rect.height };
};

export const resetComponentShadowDOM = (element: HTMLElement) => {
  if (element.shadowRoot) {
    element.shadowRoot.innerHTML = "";
  }
};

export const resetComponent = (element: HTMLElement) => {
  element.innerHTML = "";
};

export const assignSize = (el1: CodigaElement, el2: HTMLElement) => {
  const el2Width = el2.clientWidth;
  const el2Height = el2.clientHeight;

  el1.width = el2Width;
  el1.height = el2Height;
};

export const groupBy = (l: Array<any>, key: string) => {
  return l.reduce((acc, curr) => {
    (acc[curr[key]] = acc[curr[key]] || []).push(curr);
    return acc;
  }, {});
};

export const timeout = (prom: Promise<any>, time: number) =>
	Promise.race([prom, new Promise((_r, rej) => setTimeout(rej, time))]);