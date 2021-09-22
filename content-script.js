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
            codigaExtensionElement.style.cssText += 'position: absolute; top: 0px; left: 0px';

            codigaExtensionHighlightsElement = document.createElement("codiga-extension-highlights");
            codigaExtensionHighlightsElement.style.cssText += 'position: absolute; top: 0px; left: 0px';
            
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
                    if(lineElement.getAttribute("class", "CodeMirror-line")){
                        return lineElement.textContent.replace(/\u200B/g,'');
                    } else {
                        const codeLine = lineElement.querySelector(".CodeMirror-line")
                        return codeLine.textContent.replace(/\u200B/g,'');
                    }
                }).filter(line => line).join("\n");
                const language = pickLanguage();
                
                chrome.runtime.sendMessage(
                    {
                        contentScriptQuery: "validateCode",
                        data: { 
                            code,
                            language 
                        }
                    }, function (violations) {
                        codigaExtensionHighlightsElement.shadowRoot.innerHTML = '';

                        const codigaHighlightsStyle = document.createElement("style");
                        codigaHighlightsStyle.innerHTML = `
                            .codiga-highlight {
                                position: absolute;
                                border-bottom: solid 2px red; 
                                z-index: 3; 
                            }

                            .codiga-highlight:hover{
                                background: #c1424282;
                                border-bottom: solid 2px yellow; 
                            }
                        `;
                        codigaExtensionHighlightsElement.shadowRoot.appendChild(codigaHighlightsStyle);

                        violations.forEach(violation => {
                            const line = violation.line;

                            const lineToHighlight = codeElement.children.item(line - 1);
                            console.log(lineToHighlight.getAttribute("class"));
                            const isCodeMirrorLine = lineToHighlight.getAttribute("class").includes("CodeMirror-line");
                            const codeWrapperElement = isCodeMirrorLine?lineToHighlight:lineToHighlight.querySelector(".CodeMirror-line");
                            const codeToHighlight = codeWrapperElement.querySelector("[role=presentation]");
                            const highlightPosition = getPos(codeToHighlight);
                            const highlightDimensions = getHighlightDimensions(codeToHighlight, codeWrapperElement);
                            const highlightsWrapperPosition = getPos(codigaExtensionHighlightsElement);

                            const codigaHighlight = document.createElement("codiga-highlight");
                            codigaHighlight.classList.add('codiga-highlight');
                            
                            codigaHighlight.top = highlightPosition.y - highlightsWrapperPosition.y;
                            codigaHighlight.left = highlightPosition.x - highlightsWrapperPosition.x;
                            
                            codigaHighlight.width = highlightDimensions.width;
                            codigaHighlight.height = highlightDimensions.height;
                            const createdElements = addTooltipToHighlight(codigaHighlight, violation);
                            
                            codigaExtensionHighlightsElement.shadowRoot.appendChild(codigaHighlight);

                            createdElements.forEach(createdElement => {
                                codigaExtensionHighlightsElement.shadowRoot.appendChild(createdElement);
                            });
                        })
                    }
                );
            });
        }
    }
});

const show = (tooltip, popperInstance) => {
    return function(){
        tooltip.setAttribute('data-show', '');

        // We need to tell Popper to update the tooltip position
        // after we show the tooltip, otherwise it will be incorrect
        popperInstance.update();
    }
}
  
const hide = (tooltip) => {
    return function(){
        tooltip.removeAttribute('data-show');
    }
}
  
const getHighlightDimensions = (codeToHighlight, lineToHighlight) => {
    return lineToHighlight.textContent.replace(/\u200B/g,'').length?
        getDimensions(codeToHighlight):
        getDimensions(lineToHighlight)
}

const addTooltipToHighlight = (highlight, violation) => {

    const tooltip = document.createElement("div");
    const style = document.createElement("style");
    style.innerHTML = `
        .codiga-tooltip {
            background: white;
            display: none;
            padding: .5rem;
        }

        .code-inspector-violation {
            color: #9e3766;
            font-size: 1.1rem;
        }

        .codiga-tooltip[data-show] {
            background: white;
            display: block;
            min-width: max-content;
            color: black;
            z-index: 10;
        }
    `;

    tooltip.innerHTML = 
        `<div>Code Inspector violation</div>
         <div class="code-inspector-violation"> ${violation.description} </div>
         <div><b>Category: </b> ${violation.category} </div>
        `;
    tooltip.classList.add("codiga-tooltip");

    const popperInstance = Popper.createPopper(highlight, tooltip);

    const showEvents = ['mouseenter', 'focus'];
    showEvents.forEach((event) => {
        highlight.addEventListener(event, show(tooltip, popperInstance));
    });
    
    const hideEvents = ['mouseleave', 'blur'];
    hideEvents.forEach((event) => {
        highlight.addEventListener(event, hide(tooltip));
    });

    return [tooltip, style];
}