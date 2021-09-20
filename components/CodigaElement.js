class CodigaElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'}); // sets and returns 'this.shadowRoot'

        this.wrapper = document.createElement('div');
        this.wrapper.setAttribute('class','codiga-wrapper');        

        const style = document.createElement('style');
        style.innerHTML = `
            .codiga-wrapper { 
                position: absolute;
                left: 0;
                top: 0;
            }
        `;

        this.shadowRoot.append(style, this.wrapper);
    }

    static get observedAttributes() {
        return ['wrapperWidth', 'wrapperHeight'];
    }

    get wrapperWidth() {
        return this.getAttribute('wrapperWidth');
    }

    get wrapperHeight() {
        return this.getAttribute('wrapperHeight');
    }

    set wrapperWidth(val) {
        if (val == null) {
            this.removeAttribute('wrapperWidth');
        } else {
            this.setAttribute('wrapperWidth', val);
        }
    }

    set wrapperHeight(val) {
        if (val == null) { 
            this.removeAttribute('wrapperHeight');
        } else {
            this.setAttribute('wrapperHeight', val);
        }
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
window.customElements.define('codiga-element', CodigaElement);