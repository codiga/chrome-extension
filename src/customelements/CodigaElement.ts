import '@webcomponents/custom-elements';

export default class CodigaElement extends HTMLElement {
  wrapper: HTMLElement;

  constructor() {
    super();
    this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'

    this.wrapper = document.createElement("div");
    this.wrapper.setAttribute("class", "codiga-wrapper");
    this.shadowRoot.append(this.wrapper);
  }

  static get observedAttributes() {
    return ["width", "height"];
  }

  get width(): number {
    return Number(this.getAttribute("width")) || 0;
  }

  set width(val: number) {
    if (val == null) {
      this.removeAttribute("width");
    } else {
      this.setAttribute("width", `${val}`);
    }
  }

  get height(): number {
    return Number(this.getAttribute("height")) || 0;
  }

  set height(val: number) {
    if (val == null) {
      this.removeAttribute("height");
    } else {
      this.setAttribute("height", `${val}`);
    }
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: number) {
    if (name === "width") {
      this.wrapper.style.width = `${newValue}px`;
    }

    if (name === "height") {
      this.wrapper.style.height = `${newValue}px`;
    }
  }
}