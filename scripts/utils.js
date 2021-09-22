const getPos = (el) => {
    var rect=el.getBoundingClientRect();
    return {x: rect.left, y: rect.top};
}

const getDimensions = (el) => {
    var rect = el.getBoundingClientRect();
    return {width: rect.width, height: rect.height};
}

