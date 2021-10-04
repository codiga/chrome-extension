const detectCodeBoxInstances = (mutationsList) => {
    for(const mutation of mutationsList){
        if(mutation.type === 'childList'){
            const codeElement = 
                containerElement.container
                    .querySelector('.js-file-line-container:not([detected=true])');
            if(codeElement){
                const topOffset = getPos(containerElement.container.querySelector('.Box-body')).top;
                addLogicToCodeBoxInstance(codeElement, topOffset);
            }
        }
    }
};


if(containerElement.isView){
    const observer = new MutationObserver(detectCodeBoxInstances);
    observer.observe(containerElement.container, config);
}

const startAnalysis = (codeEventContext) => {
    const {
        codigaExtensionElement, 
        codigaExtensionHighlightsElement, 
        codeBoxContainer
    } = codeEventContext;

    assignSize(codigaExtensionHighlightsElement, codeBoxContainer);
    assignSize(codigaExtensionElement, codeBoxContainer);
    
    const code = getCodeFromTable(codeBoxContainer);
    const language = pickLanguage();
    const filename = pickFilename();

    const codigaContext = {
        code, 
        language, 
        codigaExtensionHighlightsElement, 
        codigaExtensionElement, 
        filename,
        scrollContainer: codeBoxContainer,
        codeElement: codeBoxContainer
    }

    runCodeValidation(codigaContext);
}

const addHiglightToViewViolation = (violation, codigaExtensionHighlightsElement, codeElement) => {
    const line = violation.line;
    const lineToHighlight = Array.from(codeElement.querySelectorAll('tr')).find(child => {
        return child.querySelector('.blob-num').getAttribute('data-line-number') === `${line}`;
    });
    if(!lineToHighlight) return;
    
    const codeToHighlight = lineToHighlight.querySelector('.blob-code');
    const highlightPosition = getPos(codeToHighlight.firstChild);

    const lastChildPositionX = getPos(codeToHighlight.lastChild).x;
    const lastChildWidth = getDimensions(codeToHighlight.lastChild).width;
    const rightBound = lastChildPositionX + lastChildWidth;
    const highlightWidth = rightBound - highlightPosition.x;

    const highlightHeight = getDimensions(codeToHighlight.firstChild).height;
    const highlightsWrapperPosition = getPos(codigaExtensionHighlightsElement);
    const codigaHighlight = document.createElement("codiga-highlight");

    codigaHighlight.classList.add('codiga-highlight');

    codigaHighlight.top = highlightPosition.y - highlightsWrapperPosition.y;
    codigaHighlight.left = highlightPosition.x - highlightsWrapperPosition.x;
    
    codigaHighlight.width = highlightWidth;
    codigaHighlight.height = highlightHeight;

    const createdElements = addTooltipToHighlight(codigaHighlight, violation);
    
    codigaExtensionHighlightsElement.shadowRoot.appendChild(codigaHighlight);

    createdElements.forEach(createdElement => {
        codigaExtensionHighlightsElement.shadowRoot.appendChild(createdElement);
    });
}

const addLogicToCodeBoxInstance = (codeBox, topOffset) => {
    // Without header we cannot set the position of highlights nor loading indicator correctly
    codeBox.setAttribute("detected", true);
    const codeBoxContainer = codeBox.querySelector('tbody');
    codeBoxContainer.setAttribute(CODIGA_ELEMENT_ID_KEY, JSON.stringify(getPos(codeBoxContainer)));

    const codigaExtensionElement = document.createElement("codiga-extension");
    codigaExtensionElement.style.cssText += `position: absolute; top: ${topOffset}px; left: 0px`;
    codeBoxContainer.insertBefore(codigaExtensionElement, codeBoxContainer.firstChild);

    const codigaExtensionHighlightsElement = document.createElement("codiga-extension-highlights");
    codigaExtensionHighlightsElement.style.cssText += `position: absolute; top: ${topOffset}px; left: 0px`;
    codeBoxContainer.insertBefore(codigaExtensionHighlightsElement, codeBoxContainer.firstChild);
    
    const context = {
        codigaExtensionElement, 
        codigaExtensionHighlightsElement, 
        codeBoxContainer
    }

    startAnalysis(context);

    window.addEventListener("resize", () => {
        assignSize(codigaExtensionElement, codeBoxContainer);
    });
}

const getCodeFromTable = (codeBox) => {
    return Array.from(codeBox.querySelectorAll('tr')).map(tr => {
        return tr.querySelector('.blob-code').textContent.replace(/\u200B/g,'').replace('\n', '');
    }).join("\n");
}