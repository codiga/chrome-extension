// General functionality
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

const runCodeValidation = ({
    code, 
    language, 
    codigaExtensionHighlightsElement, 
    codigaExtensionElement, 
    codeElement, 
    filename,
    scrollContainer
}) => {
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
        }, (result) => {
            if(!result.violations){
                statusButton.status = CodigaStatus.ALL_GOOD;
            } else {
                addHighlights(codigaExtensionHighlightsElement, result.violations, codeElement);
                updateStatusButton(statusButton, result.violations);
                
                // On scroll highlights should be updated
                let timer = null;
                scrollContainer.addEventListener('scroll', function() {
                    resetComponentShadowDOM(codigaExtensionHighlightsElement);
                    
                    if(timer !== null) {
                        clearTimeout(timer);        
                    }

                    timer = setTimeout(function() {
                        updateStatusButton(statusButton, result.violations);
                        addHighlights(codigaExtensionHighlightsElement, result.violations, codeElement);
                    }, 150);
                    
                }, false);

            }
        }
    );
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
            height: 0.1rem;
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
        if(containerElement.isEdit){ // Edit views also have .repository-content component
            addHiglightToEditViolation(violation, codigaExtensionHighlightsElement, codeElement);
        } else {
            addHiglightToViewViolation(violation, codigaExtensionHighlightsElement, codeElement);
        }
    });
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

const getHighlightDimensionsFromElements = (codeToHighlightElements) => {
    return codeToHighlightElements.reduce((acc, curr) => {
        const currDim = getDimensions(curr);
        return {
            width: currDim.width + acc.width,
            height: currDim.height
        }
    }, { width: 0, height: 0});
}

const addTooltipToHighlight = (highlight, violation) => {
    const tooltip = document.createElement("div");
    const style = document.createElement("style");
    style.innerHTML = `
        .codiga-tooltip {
            display: none;
        }

        .codiga-tooltip[data-show] {
            background: #300623;
            color: white;
            display: block;
            min-width: max-content;
            z-index: 10;
            border-radius: .2rem;
            padding: .6rem;
            border: 1px solid white;
        }
        
        .single-violation {
            border-top: 1px solid white;
            padding: .4rem 0;
        }
    `;

    
    tooltip.innerHTML = 
        `
        <img src='${chrome.runtime.getURL('icons/icon16.png')}'/>
        <div class="violations-list">
        ${
            violation.group.map((violation, index) => {
                return `<div class="single-violation">
                    <div class="codiga-tooltip-header"><b>${index + 1}. ${PRETTY_CATEGORIES[violation.category] || violation.category}</b> violation:</div>
                    <div class="codiga-inspector-violation"> ${violation.description} </div>
                </div>`
            }).join('')
        }
        </div>
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
            right: 1rem;
            bottom: 1rem;
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
            background: url(${chrome.runtime.getURL('icons/icon48.png')});
            background-position: center; /* Center the image */
            background-repeat: no-repeat; /* Do not repeat the image */
            background-size: cover;
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

// Start point
if(containerElement.isView){
    const topOffset = getPos(containerElement.container).top;
    addLogicToCodeBoxInstance(containerElement.container, topOffset);
}

if(containerElement.isEdit){
    const observer = new MutationObserver(detectCodeMirrorInstances);
    observer.observe(containerElement.container, config);
}
