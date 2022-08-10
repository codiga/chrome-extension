import "@webcomponents/custom-elements";

import * as ReactDOM from "react-dom/client";
import React from "react";
import Shortcuts from "./Shortcuts";
import { Position, ShortcutContext } from "../lib/types";

const style = `
  .codiga-shortcut-dropdown button {
    padding: 0.3rem;
    background: white;
    border-radius: 2px;
    margin: 0.1px;
    border: 1px solid #74767A;
    font-size: 14px;
    font-family: 'IBM Plex Sans',sans-serif;
  }

  .codiga-shortcut-dropdown button:hover {
    cursor: pointer;
    background: #F0F1F2;
  }
`;

export default class ShortcutDropdown extends HTMLElement {
  root: ReactDOM.Root;
  _context: ShortcutContext;
  _position: Position;

  constructor() {
    super();

    const mountPoint = document.createElement("div");
    mountPoint.setAttribute("class", "codiga-shortcut-dropdown");
    this.attachShadow({ mode: "open" });

    const innerStyle = document.createElement("style");
    innerStyle.innerHTML = style;

    this.shadowRoot.append(innerStyle);
    this.shadowRoot.appendChild(mountPoint);

    this.root = ReactDOM.createRoot(mountPoint);
  }

  set position(position: Position) {
    this._position = position;
  }

  get position() {
    return this._position;
  }

  set context(context: ShortcutContext) {
    this.root.render(<Shortcuts context={context} />);
    this._context = context;
  }

  get context() {
    return this._context;
  }

  get top(): number {
    return Number(this.getAttribute("top")) || 0;
  }

  get left(): number {
    return Number(this.getAttribute("left")) || 0;
  }

  set top(val: number) {
    if (val == null) {
      this.removeAttribute("top");
    } else {
      this.setAttribute("top", `${val}`);
    }
  }

  set left(val: number) {
    if (val == null) {
      this.removeAttribute("left");
    } else {
      this.setAttribute("left", `${val}`);
    }
  }

  static get observedAttributes() {
    return ["top", "left"];
  }

  attributeChangedCallback(name: string, oldValue: number, newValue: number) {
    if (name === "top") {
      this.style.top = `${newValue}px`;
    }

    if (name === "left") {
      this.style.left = `${newValue}px`;
    }
  }
}
