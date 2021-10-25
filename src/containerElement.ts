export const CODIGA_ELEMENT_ID_KEY = "codiga-id";

export type ContainerElement = {
  isEdit: boolean;
  isView: boolean;
  isPull: boolean;
  container: HTMLElement;
};

export const getContainerElement = (): ContainerElement => {
  // Edit code GitHub or Jupyter view or Jupyter Lab
  const codeMirrorContainer = <HTMLElement>(
    document.querySelector(".commit-create")
  ) || <HTMLElement> document.querySelector("#notebook")
  || <HTMLElement> document.querySelector(".jp-MainAreaWidget");
    
  // View code GitHub view
  const codeBoxContainer = <HTMLElement> document.querySelector(".blob-wrapper");

  // Pull request in GitHub
  const diffContainer = <HTMLElement> document.querySelector(".diff-view");
  
  return {
    isEdit: codeMirrorContainer !== undefined && codeMirrorContainer !== null,
    isView: codeBoxContainer !== undefined && codeBoxContainer !== null,
    isPull: diffContainer !== undefined && diffContainer !== null,
    container: codeMirrorContainer || codeBoxContainer || diffContainer,
  };
};
