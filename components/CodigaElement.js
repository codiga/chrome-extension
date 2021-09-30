class CodigaElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'}); // sets and returns 'this.shadowRoot'

        this.wrapper = document.createElement('div');
        this.wrapper.setAttribute('class','codiga-wrapper');        
        this.shadowRoot.append(this.wrapper);
    }

    static get observedAttributes() {
        return ['width', 'height'];
    }

    get width() {
        return this.getAttribute('width');
    }

    get height() {
        return this.getAttribute('height');
    }

    set width(val) {
        if (val == null) {
            this.removeAttribute('width');
        } else {
            this.setAttribute('width', val);
        }
    }

    set height(val) {
        if (val == null) { 
            this.removeAttribute('height');
        } else {
            this.setAttribute('height', val);
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'width') {
            this.wrapper.style.width = `${newValue}px`;
        }

        if (name === 'height') {
            this.wrapper.style.height = `${newValue}px`;
        }
    }
}
window.customElements.define('codiga-element', CodigaElement);