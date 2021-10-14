import '@webcomponents/custom-elements';

/**
 * Violation highlight web component, position and size are relative to the code so it's necessary
 * to have all those fields observed.
 */
export default class CodigaHighlight extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["width", "height", "top", "left"];
  }

  get width(): number {
    return Number(this.getAttribute("width")) || 0;
  }

  get height(): number {
    return Number(this.getAttribute("height")) || 0;
  }

  set width(val: number) {
    if (val == null) {
      this.removeAttribute("width");
    } else {
      this.setAttribute("width", `${val}`);
    }
  }

  set height(val: number) {
    if (val == null) {
      this.removeAttribute("height");
    } else {
      this.setAttribute("height", `${val}`);
    }
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

  attributeChangedCallback(name: string, oldValue: any, newValue: number) {
    if (name === "width") {
      this.style.width = `${newValue}px`;
    }

    if (name === "height") {
      this.style.height = `${newValue}px`;
    }

    if (name === "top") {
      this.style.top = `${newValue}px`;
    }

    if (name === "left") {
      this.style.left = `${newValue}px`;
    }
  }
}
