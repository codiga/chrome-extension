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
        this.getAttribute('wrapperWidth');
    }

    get wrapperHeight() {
        this.getAttribute('wrapperHeight');
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

class CodigaExtensionHighLights extends CodigaElement {
    constructor() {
        super();
    }
}
window.customElements.define('codiga-extension-highlights', CodigaExtensionHighLights);

document.addEventListener("DOMSubtreeModified", function(event){
    const codeMirrorList = Array.from(document.getElementsByClassName('CodeMirror-lines'));
    
    for(let codeMirrorIndex in codeMirrorList){
        const codeMirror = codeMirrorList[codeMirrorIndex];
        const codeMirrorSizer = codeMirror.closest('.CodeMirror-sizer');

        const presentation = codeMirror.querySelector('[role="presentation"]');

        let codigaExtensionElement;
        let codigaExtensionHighlightsElement;
        let codeElement = codeMirror.querySelector(".CodeMirror-code");
        
        if(!codeMirror.querySelectorAll("codiga-extension").length){
            codigaExtensionElement = document.createElement("codiga-extension");
            codigaExtensionElement.style.cssText += 'position: absolute; top: 0px; left: 0px; pointer-events: none;';

            codigaExtensionHighlightsElement = document.createElement("codiga-extension-highlights");
            codigaExtensionHighlightsElement.style.cssText += 'position: absolute; top: 0px; left: 0px; pointer-events: none;';
            
            presentation.insertBefore(codigaExtensionElement, presentation.firstChild);
            presentation.insertBefore(codigaExtensionHighlightsElement, presentation.firstChild);
            
            codeMirror.addEventListener("click", function(){
                const codeMirrorWidth = codeMirrorSizer.clientWidth;
                const codeMirrorHeight = codeMirrorSizer.clientHeight;

                codigaExtensionElement.wrapperWidth = codeMirrorWidth;
                codigaExtensionElement.wrapperHeight = codeMirrorHeight;

                codigaExtensionHighlightsElement.wrapperWidth = codeMirrorWidth;
                codigaExtensionHighlightsElement.wrapperHeight = codeMirrorHeight;

                const code = Array.from(codeElement.children).map(lineElement => {
                    return lineElement.querySelector(".CodeMirror-line").textContent;
                }).join("\n");
                
                chrome.runtime.sendMessage(
                    {
                        contentScriptQuery: "validateCode",
                        data: { code }
                    }, function (response) {
                        const violations = response.data.getFileAnalysis.violations;

                        const elementsToHighlight = violations.map(violation => {
                            const line = violation.line;
                            const severity = violation.severity;
                            const category = violation.category;
                            
                        })
                    }
                );
            });
        }
    };
});
