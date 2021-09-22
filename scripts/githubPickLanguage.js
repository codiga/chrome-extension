const pickLanguage = () => {
    const textAreaElement = document.querySelector('textarea.file-editor-textarea.js-code-textarea');
    const codeAttribute = textAreaElement.getAttribute('data-codemirror-mode');

    return {
        "text/javascript": "Javascript",
        "text/x-python": "Python"
    }[codeAttribute]
}