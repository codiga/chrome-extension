// General functionality
const CODIGA_ELEMENT_ID_KEY="codiga-id";
const containerElement = getContainerElement();

const config = { childList: true, subtree: true };

const PRETTY_CATEGORIES = {
    "Code_Style": "Code style",
    "Error_Prone": "Error prone",
    "Documentation": "Documentation",
    "Security": "Security",
    "Design": "Design",
    "Safety": "Safety",
    "Best_Practice": "Best practice",
    "Unknown": "Unknown"
}

const detectCodeMirrorInstances = (mutationsList) => {
    for(const mutation of mutationsList){
        if(mutation.type === 'childList'){
            addCodeMirrorListeners()
        }
    }
};

const observer = new MutationObserver(detectCodeMirrorInstances);
observer.observe(containerElement, config);

const addLogicToCodeMirrorInstance = (codeMirror) => {
    codeMirror.setAttribute("detected", true);

    const codeMirrorLines = codeMirror.querySelector(".CodeMirror-lines")
    const codeMirrorSizer = codeMirror.querySelector('.CodeMirror-sizer');

    const codePresentation = codeMirrorLines.querySelector('[role="presentation"]');

    let codeElement = codeMirror.querySelector(".CodeMirror-code");
    codeElement.setAttribute(CODIGA_ELEMENT_ID_KEY, JSON.stringify(getPos(codeElement)));

    const codigaExtensionElement = document.createElement("codiga-extension");
    codigaExtensionElement.style.cssText += 'position: absolute; top: 0px; left: 0px';
    codePresentation.insertBefore(codigaExtensionElement, codePresentation.firstChild);

    const codigaExtensionHighlightsElement = document.createElement("codiga-extension-highlights");
    codigaExtensionHighlightsElement.style.cssText += 'position: absolute; top: 0px; left: 0px';
    codePresentation.insertBefore(codigaExtensionHighlightsElement, codePresentation.firstChild);
    
    codeMirror.addEventListener("click", () => {
        eventListenerCallback(codeMirrorSizer, codigaExtensionElement, codigaExtensionHighlightsElement, codeElement);
    });

    let textArea = codeMirror.parentElement.querySelector("textarea");
    textArea.addEventListener("change", () => {
        eventListenerCallback(codeMirrorSizer, codigaExtensionElement, codigaExtensionHighlightsElement, codeElement);
    });

    textArea.addEventListener("input", () => {
        eventListenerCallback(codeMirrorSizer, codigaExtensionElement, codigaExtensionHighlightsElement, codeElement);
    });

    window.addEventListener("resize", () => {
        assignSize(codigaExtensionElement, codeMirrorSizer);
    })
}

const eventListenerCallback = (codeMirrorSizer, codigaExtensionElement, codigaExtensionHighlightsElement, codeElement) => {
    assignSize(codigaExtensionHighlightsElement, codeMirrorSizer);
    assignSize(codigaExtensionElement, codeMirrorSizer);
    
    const code = getCode(codeElement);
    const language = pickLanguage();
    const filename = pickFilename();

    const codigaContext = {
        code, 
        language, 
        codigaExtensionHighlightsElement, 
        codigaExtensionElement, 
        codeElement,
        filename
    }

    runCodeValidation(codigaContext)
}

const runCodeValidation = ({code, language, codigaExtensionHighlightsElement, codigaExtensionElement, codeElement, filename}) => {
    const statusButton = getStatusButton(codigaExtensionElement);
    statusButton.status = CodigaStatus.LOADING;
    
    resetComponentShadowDOM(codigaExtensionHighlightsElement);

    chrome.runtime.sendMessage(
        {
            contentScriptQuery: "validateCode",
            data: { 
                code,
                language,
                filename,
                id: codeElement.getAttribute(CODIGA_ELEMENT_ID_KEY)
            }
        }, function (violations) {
            if(!violations){
                statusButton.status = CodigaStatus.LOADING;
            } else {
                addHighlights(codigaExtensionHighlightsElement, violations, codeElement);
                updateStatusButton(statusButton, violations);
            }
        }
    );
}

const getCode = (codeElement) => {
    return Array.from(codeElement.children).map(lineElement => {
        if(lineElement.getAttribute("class", "CodeMirror-line")){
            return lineElement.textContent.replace(/\u200B/g,'');
        } else {
            const codeLine = lineElement.querySelector(".CodeMirror-line")
            return codeLine.textContent.replace(/\u200B/g,'');
        }
    }).join("\n");
}

const addHighlights = (codigaExtensionHighlightsElement, violations, codeElement) => {
    resetComponentShadowDOM(codigaExtensionHighlightsElement);

    const codigaHighlightsStyle = document.createElement("style");
    codigaHighlightsStyle.innerHTML = `
        .codiga-highlight {
            position: absolute;
            z-index: 3; 
        }

        /* Slide in */
        .codiga-highlight {
            overflow: hidden;
        }

        @keyframes slidein {
            from {
              transform: translate3d(-100%, 0, 0);
            }
          
            to {
              transform: translate3d(0, 0, 0);
            }
        }

        .codiga-highlight::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 0.2em;
            background-color: #cc498b;
            opacity: 1;
            animation: slidein .2s;
        }
        
        .codiga-highlight:hover{
            background: #c1424282;
        }
    `;
    codigaExtensionHighlightsElement.shadowRoot.appendChild(codigaHighlightsStyle);

    violations.forEach(violation => {
        addHiglightToViolation(violation, codigaExtensionHighlightsElement, codeElement);
    });
}

const addHiglightToViolation = (violation, codigaExtensionHighlightsElement, codeElement) => {
    const line = violation.line;     
    const lineToHighlight = codeElement.children.item(line - 1);
    if(!lineToHighlight) return;
    
    const lineToHighlightClass = lineToHighlight.getAttribute("class");
    const isCodeMirrorLine = lineToHighlightClass && lineToHighlightClass.includes("CodeMirror-line");
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
}

const addCodeMirrorListeners = () => {
    const codeMirrorList = Array.from(document.querySelectorAll('.CodeMirror:not([detected=true])'));
    codeMirrorList.forEach(addLogicToCodeMirrorInstance);
}

const showTooltip = (tooltip, popperInstance) => {
    return () => {
        tooltip.setAttribute('data-show', '');

        // We need to tell Popper to update the tooltip position
        // after we show the tooltip, otherwise it will be incorrect
        popperInstance.update();
    }
}
  
const hideTooltip = (tooltip) => {
    return () => {
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

    
    console.log(PRETTY_CATEGORIES, violation.category);
    tooltip.innerHTML = 
        `<div>Codiga violation</div>
         <div class="code-inspector-violation"> ${violation.description} </div>
         <div><b>Category: </b> ${PRETTY_CATEGORIES[violation.category] || violation.category} </div>
        `;
    tooltip.classList.add("codiga-tooltip");

    const popperInstance = Popper.createPopper(highlight, tooltip);

    const showEvents = ['mouseenter', 'focus'];
    showEvents.forEach((event) => {
        highlight.addEventListener(event, showTooltip(tooltip, popperInstance));
    });
    
    const hideEvents = ['mouseleave', 'blur'];
    hideEvents.forEach((event) => {
        highlight.addEventListener(event, hideTooltip(tooltip));
    });

    return [tooltip, style];
}

const getStatusButton = (codigaExtensionElement) => {
    const codigaWrapper = codigaExtensionElement.shadowRoot.querySelector('.codiga-wrapper')
    const codigaButtonDOM = codigaWrapper.querySelector('codiga-status-btn');

    if(codigaButtonDOM){
        return codigaButtonDOM;
    }   

    const codigaButton = document.createElement("codiga-status-btn");
    codigaButton.status = CodigaStatus.LOADING;
    codigaWrapper.appendChild(codigaButton);

    const codigaStatusButtonStyle = document.createElement("style");
    codigaStatusButtonStyle.innerHTML = `
        .codiga-status-btn {
            position: absolute;
            right: .6rem;
            bottom: .6rem;
            z-index: 5;
            border-radius: 100%;
            font-weight: bold;
            width: 26px;
            height: 26px;
            justify-content: center;
            align-items: center;
            display: flex;
            font-size: 15px;
            color: white;
        }

        @keyframes spin { 
            100% { 
                -webkit-transform: rotate(360deg); 
                transform:rotate(360deg); 
            } 
        }

        .clear{
            background: #5ca258;
        }

        .loading{
            background: #061fa3;
            animation:spin 4s linear infinite;
        }

        .violations{
            background: #d25b5b;
        }
    `;
    codigaExtensionElement.shadowRoot.appendChild(codigaStatusButtonStyle);

    return codigaButton;
}

const updateStatusButton = (statusButton, violations) => {
    statusButton.status = violations.length || CodigaStatus.ALL_GOOD;
}