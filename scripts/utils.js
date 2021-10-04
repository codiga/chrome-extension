const getBoudingClientRect = (el) => {
    let rect;
    if(el['getBoundingClientRect']){
        rect=el.getBoundingClientRect();
    } else {
        var range = document.createRange();
        range.selectNode(el);
        rect = range.getBoundingClientRect();
        range.detach();
    }

    return rect;
}

const getPos = (el) => {
    const rect = getBoudingClientRect(el);
    return {x: rect.left, y: rect.top};
}

const getDimensions = (el) => {
    let rect = getBoudingClientRect(el);
    return {width: rect.width, height: rect.height};
}

const resetComponentShadowDOM = (element) => {
    element.shadowRoot.innerHTML = '';
}

const assignSize = (el1, el2) => {
    const el2Width = el2.clientWidth;
    const el2Height = el2.clientHeight;

    el1.width = el2Width;
    el1.height = el2Height;
}