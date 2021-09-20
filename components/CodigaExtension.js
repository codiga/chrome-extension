class CodigaExtension extends CodigaElement {
    constructor() {
        super();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'wrapperWidth') {
            this.wrapper.style.width = `${newValue}px`;
        }

        if (name === 'wrapperHeight') {
            this.wrapper.style.height = `${newValue}px`;
        }
    }
}
window.customElements.define('codiga-extension', CodigaExtension);