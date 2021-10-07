export const pickFilename = () => {
  const textAreaElement = document.querySelector(
    "textarea.file-editor-textarea.js-code-textarea"
  );

  const result = textAreaElement
    ? textAreaElement.getAttribute("data-filename") // CodeMirror scenario in GitHub. When user is editing a file.
    : document.querySelector(".final-path")?.textContent; // Table scenario in GitHub. When user is viewing a file.

  return result;
};
