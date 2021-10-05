const detectCodeMirrorInstances = (mutationsList) => {
    for(const mutation of mutationsList){
        if(mutation.type === 'childList'){
            addCodeMirrorListeners()
        }
    }
};

if(containerElement.isEdit){
    const observer = new MutationObserver(detectCodeMirrorInstances);
    observer.observe(containerElement.container, config);
}

const eventListenerCallback = (codeEventContext) => {
    const {
        codigaExtensionElement, 
        codigaExtensionHighlightsElement, 
        codeElement,
        textArea,
        scrollContainer,
        codeMirror
    } = codeEventContext;

    assignSize(codigaExtensionHighlightsElement, codeMirror);
    assignSize(codigaExtensionElement, codeMirror);
    
    const code = getCodeFromTextArea(textArea);
    const language = pickLanguage();
    const filename = pickFilename();

    const codigaContext = {
        code, 
        language, 
        codigaExtensionHighlightsElement, 
        codigaExtensionElement, 
        codeElement,
        filename,
        scrollContainer
    }

    runCodeValidation(codigaContext)
}

const addHiglightToEditViolation = (violation, codigaExtensionHighlightsElement, codeElement) => {
    const line = violation.line;
    const lineToHighlight = Array.from(codeElement.children).find(child => {
        return child.querySelector('.CodeMirror-gutter-wrapper').textContent === `${line}`;
    });
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

const addLogicToCodeMirrorInstance = (codeMirror) => {
    codeMirror.setAttribute("detected", true);

    const codeMirrorLines = codeMirror.querySelector(".CodeMirror-lines");
    const codeMirrorSizer = codeMirror.querySelector('.CodeMirror-code');
    const codeScroll = codeMirror.querySelector('.CodeMirror-scroll');

    const codePresentation = codeMirrorLines.querySelector('[role="presentation"]');

    let codeElement = codeMirror.querySelector(".CodeMirror-code");
    codeElement.setAttribute(CODIGA_ELEMENT_ID_KEY, JSON.stringify(getPos(codeElement)));

    const codigaExtensionElement = document.createElement("codiga-extension");
    codigaExtensionElement.style.cssText += 'position: absolute; top: 0px; left: 0px';
    codeMirror.insertBefore(codigaExtensionElement, codeMirror.firstChild);

    const codigaExtensionHighlightsElement = document.createElement("codiga-extension-highlights");
    codigaExtensionHighlightsElement.style.cssText += 'position: absolute; top: 0px; left: 0px';
    codePresentation.insertBefore(codigaExtensionHighlightsElement, codePresentation.firstChild);
    
    let textArea = codeMirror.parentElement.querySelector("textarea");
    const context = {
        codeMirror, 
        codigaExtensionElement, 
        codigaExtensionHighlightsElement, 
        codeElement, 
        textArea,
        scrollContainer: codeScroll
    }

    eventListenerCallback(context);

    textArea.addEventListener("change", () => {
        eventListenerCallback(context);
    });

    textArea.addEventListener("input", () => {
        eventListenerCallback(context);
    });

    window.addEventListener("resize", () => {
        assignSize(codigaExtensionElement, codeMirror);
    });
}

const getCodeFromTextArea = (textarea) => {
    return textarea.value;
}