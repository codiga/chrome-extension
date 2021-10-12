export const pickFilename = (diffElement: HTMLElement) => {
  const diffWrapperHeader = diffElement.closest(".file")?.querySelector('a');
  return diffWrapperHeader.textContent;
};
