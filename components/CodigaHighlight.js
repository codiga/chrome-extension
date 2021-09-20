class CodigaHighlight extends HTMLElement {
    constructor() {
        super();
    }

    static get observedAttributes() {
        return ['width', 'height', 'top', 'left'];
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

    get top() {
        return this.getAttribute('top');
    }

    get left() {
        return this.getAttribute('left');
    }

    set top(val) {
        if (val == null) {
            this.removeAttribute('top');
        } else {
            this.setAttribute('top', val);
        }
    }

    set left(val) {
        if (val == null) { 
            this.removeAttribute('left');
        } else {
            this.setAttribute('left', val);
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'width') {
            this.style.width = `${newValue}px`;
        }

        if (name === 'height') {
            this.style.height = `${newValue}px`;
        }

        if (name === 'top') {
            this.style.top = `${newValue}px`;
        }

        if (name === 'left') {
            this.style.left = `${newValue}px`;
        }
    }
} 
window.customElements.define('codiga-highlight', CodigaHighlight);
