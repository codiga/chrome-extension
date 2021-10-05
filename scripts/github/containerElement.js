const CODIGA_ELEMENT_ID_KEY="codiga-id";

const getContainerElement = () => {
    // Edit code GitHub view
    const codeMirrorContainer = document.querySelector(".commit-create");
    
    // View code GitHub view
    const codeBoxContainer = document.querySelector(".blob-wrapper");

    return {
        isEdit: codeMirrorContainer !== undefined && codeMirrorContainer !== null,
        isView: codeBoxContainer !== undefined && codeBoxContainer !== null,
        container: codeMirrorContainer || codeBoxContainer
    }
}

const containerElement = getContainerElement();
const config = { childList: true, subtree: true };