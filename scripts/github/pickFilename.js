const pickFilename = () => {
    const textAreaElement = document.querySelector('textarea.file-editor-textarea.js-code-textarea');

    if(textAreaElement){
        // CodeMirror scenario in GitHub. When user is editing a file.
        return textAreaElement?.getAttribute('data-filename');
    } else {
        // Table scenario in GitHub. When user is viewing a file.
        return document.querySelector('.final-path')?.textContent;
    }
}