// Utils
const getPos = (el) => {
    var rect=el.getBoundingClientRect();
    return {x: rect.left, y: rect.top};
}

const getDimensions = (el) => {
    return {width: el.clientWidth, height: el.clientHeight};
}


// General functionality
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
                    return lineElement.querySelector(".CodeMirror-line").textContent.replace(/\u200B/g,'');
                }).join("\n");
                
                chrome.runtime.sendMessage(
                    {
                        contentScriptQuery: "validateCode",
                        data: { code }
                    }, function (violations) {
                        console.log(violations);

                        codigaExtensionHighlightsElement.shadowRoot.innerHTML = '';

                        const elementsToHighlight = violations.map(violation => {
                            const line = violation.line;
                            const severity = violation.severity;
                            const category = violation.category;

                            const lineToHighlight = codeElement.children.item(line - 1);
                            
                            const highlightPosition = getPos(lineToHighlight);
                            const highlightsWrapperPosition = getPos(codigaExtensionHighlightsElement);
                            const highlightDimensions = getDimensions(lineToHighlight);
                            
                            const codigaHighlight = document.createElement("codiga-highlight");
                            codigaHighlight.style.cssText += 'position: absolute; background-color: red';
                            
                            
                            codigaHighlight.top = highlightPosition.y - highlightsWrapperPosition.y;
                            codigaHighlight.left = highlightPosition.x - highlightsWrapperPosition.x;

                            codigaHighlight.width = highlightDimensions.width;
                            codigaHighlight.height = highlightDimensions.height;
                            
                            codigaExtensionHighlightsElement.shadowRoot.append(codigaHighlight);
                            
                            console.log(line, severity, category, highlightPosition, highlightDimensions);
                        })
                    }
                );
            });
        }
    }
});
