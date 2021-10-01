const pickFilename = () => {
    const textAreaElement = document.querySelector('textarea.file-editor-textarea.js-code-textarea');
    return textAreaElement.getAttribute('data-filename');
}