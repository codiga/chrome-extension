import {
  REPLIT_ACTIVE_FILE,
  REPLIT_EDITOR_CONTENT,
  REPLIT_FILE_TREE,
} from "../constants";

export const getLanguageFromFilename = (fileName: string) => {
  if (fileName) {
    const splittedFileName = fileName.split(".");
    const extension = splittedFileName[splittedFileName.length - 1];

    if (fileName === "Dockerfile") return "Docker";

    return (
      {
        js: "Javascript",
        py: "Python",
        java: "Java",
        cls: "Apex",
        c: "C",
        cpp: "Cpp",
        dart: "Dart",
        go: "Go",
        php: "Php",
        rb: "Ruby",
        rs: "Rust",
        scala: "Scala",
        sh: "Shell",
        ts: "Typescript",
        kt: "Kotlin",
        yaml: "Yaml",
        json: "Json",
        tf: "Terraform",
        tsx: "Typescript",
        hs: "Haskell",
        jsx: "Javascript",
      }[extension] || "Unknown"
    );
  }
};

export const pickFilename = () => {
  const activeFile = document.querySelector(REPLIT_ACTIVE_FILE);
  return activeFile.textContent;
};

export const pickLanguage = () => {
  return getLanguageFromFilename(pickFilename());
};

export const pickCodeElement = () => {
  return document.querySelector(REPLIT_EDITOR_CONTENT) as HTMLElement;
};

export const pickCodeElementId = () => {
  return pickCodeElement().getAttribute(REPLIT_EDITOR_CONTENT);
};
