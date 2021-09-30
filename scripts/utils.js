const getPos = (el) => {
    var rect=el.getBoundingClientRect();
    return {x: rect.left, y: rect.top};
}

const getDimensions = (el) => {
    var rect = el.getBoundingClientRect();
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