
import '@webcomponents/custom-elements';
export enum CodigaStatus {
  LOADING = "LOADING",
  ALL_GOOD = "ALL_GOOD",
}

export default class CodigaStatusButton extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["status"];
  }

  get status() {
    return this.getAttribute("status");
  }

  get loadingHTML() {
    return `
            <div class='loading codiga-status-btn'>
            </div>
        `;
  }

  get allGoodHTML() {
    return `
            <div class='clear codiga-status-btn'>
                &#x2714;
            </div>
        `;
  }

  get violationsHTML() {
    return `
            <div class='violations codiga-status-btn'>
                ${this.status}
            </div>
        `;
  }

  set status(val) {
    if (val == null) {
      this.removeAttribute("status");
    } else {
      this.setAttribute("status", val);
    }
  }

  attributeChangedCallback(
    name: string,
    oldValue: any,
    newValue: CodigaStatus
  ) {
    if (name === "status") {
      this.innerHTML = this.calculateInnerHTML(newValue);
    }
  }

  calculateInnerHTML(status: CodigaStatus) {
    switch (status) {
      case CodigaStatus.LOADING:
        return this.loadingHTML;
      case CodigaStatus.ALL_GOOD:
        return this.allGoodHTML;
      default:
        //If status is not LOADING or ALL_GOOD it will be the number of violations
        return this.violationsHTML;
    }
  }
}