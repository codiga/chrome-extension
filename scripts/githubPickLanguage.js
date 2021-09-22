const pickLanguage = () => {
    const textAreaElement = document.querySelector('textarea.file-editor-textarea.js-code-textarea');
    console.log(textAreaElement);
    const codeAttribute = textAreaElement.getAttribute('data-codemirror-mode');

    console.log(codeAttribute);

    return {
        "text/javascript": "Javascript",
        "text/x-python": "Python"
    }[codeAttribute]
}