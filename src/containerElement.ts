export const CODIGA_ELEMENT_ID_KEY = "codiga-id";

export type ContainerElement = {
  isEdit: boolean;
  isView: boolean;
  container: HTMLElement;
};

export const getContainerElement = (): ContainerElement => {
  // Edit code GitHub or Jupyter view
  const codeMirrorContainer = <HTMLElement>(
    document.querySelector(".commit-create")
  ) || <HTMLElement>document.querySelector("#notebook");;

  // View code GitHub view
  const codeBoxContainer = <HTMLElement>document.querySelector(".blob-wrapper");

  return {
    isEdit: codeMirrorContainer !== undefined && codeMirrorContainer !== null,
    isView: codeBoxContainer !== undefined && codeBoxContainer !== null,
    container: codeMirrorContainer || codeBoxContainer,
  };
};