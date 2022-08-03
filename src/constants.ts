export const CREATE_RECIPE_FROM_SELECTION = "CREATE_RECIPE_FROM_SELECTION";
export const BASE_URL = "https://app.codiga.io";
export const ADD_RECIPE_CREATION = "ADD_RECIPE_CREATION";
export const STACK_OVERFLOW_CODE_CLASS = ".s-code-block";

export const CODE_MIRROR_CLASS = ".CodeMirror";
export const CODIGA_API_TOKEN = "codiga-api-token";
export const INSTALL_NOTIFICATION_SHOWN = "install-notification-shown";

export const CODE_MIRROR_LINES_CLASS = ".CodeMirror-lines";
export const CODE_MIRROR_LINE_CLASS = ".CodeMirror-line";
export const CODE_MIRROR_SCROLL_CLASS = ".CodeMirror-scroll";
export const CODE_MIRROR_CODE_CLASS = ".CodeMirror-code";
export const CODE_MIRROR_GUTTER_WRAPPER_CLASS = ".CodeMirror-gutter-wrapper";

export const REPLIT_EDITOR_CONTENT = ".cm-content";
export const REPLIT_EDITOR_CLASS = ".cm-editor";
export const REPLIT_EDITOR_LINE = ".cm-line";
export const REPLIT_EDITOR_ACTIVE_LINE = ".cm-activeLine";
export const REPLIT_EDITOR_CURSOR = ".cm-cursor-primary";
export const REPLIT_EDITOR_SCROLL = ".cm-scroller";
export const REPLIT_FILE_TREE = ".dir-node";
export const REPLIT_ACTIVE_FILE = ".file-path";

export const ROLE_PRESENTATION = "[role=presentation]";

export const CODIGA_START = "codiga-start";
export const CODIGA_END = "codiga-end";

export const ADD_CODE_ASSISTANCE = "ADD_CODE_ASSISTANCE";

// 10 seconds
export const CODING_ASSISTANT_SHORTCUTS_POLLING_MS = 10000;
// 10 minutes
export const CODING_ASSISTANT_MAX_TIME_IN_CACHE_MS = 600000;

export enum Language {
  LANGUAGE_TYPESCRIPT = "Typescript",
  LANGUAGE_JAVASCRIPT = "Javascript",
  LANGUAGE_PYTHON = "Python",
  LANGUAGE_JAVA = "Java",
  LANGUAGE_UNKNOWN = "Unknown",
  LANGUAGE_DOCKER = "Docker",
  LANGUAGE_OBJECTIVE_C = "Objectivec",
  LANGUAGE_TERRAFORM = "Terraform",
  LANGUAGE_JSON = "Json",
  LANGUAGE_YAML = "Yaml",
  LANGUAGE_SWIFT = "Swift",
  LANGUAGE_SOLIDITY = "Solidity",
  LANGUAGE_SQL = "Sql",
  LANGUAGE_SHELL = "Shell",
  LANGUAGE_SCALA = "Scala",
  LANGUAGE_REACT = "React",
  LANGUAGE_PASCAL = "Pascal",
  LANGUAGE_RUST = "Rust",
  LANGUAGE_RUBY = "Ruby",
  LANGUAGE_PHP = "Php",
  LANGUAGE_PERL = "Perl",
  LANGUAGE_KOTLIN = "Kotlin",
  LANGUAGE_HTML = "Html",
  LANGUAGE_HASKELL = "Haskell",
  LANGUAGE_GO = "Go",
  LANGUAGE_DART = "Dart",
  LANGUAGE_CSHARP = "Csharp",
  LANGUAGE_CSS = "Css",
  LANGUAGE_CPP = "Cpp",
  LANGUAGE_C = "C",
  LANGUAGE_APEX = "Apex",
  LANGUAGE_VISUAL = "Visual",
  ALL_LANGUAGES = "All languages",
}

export const FILTERED_LANGUAGES = [
  Language.LANGUAGE_UNKNOWN,
  Language.ALL_LANGUAGES,
  Language.LANGUAGE_REACT,
  Language.LANGUAGE_PASCAL,
  Language.LANGUAGE_VISUAL,
  Language.LANGUAGE_PERL,
];

export const ALL_LANGUAGES = Object.values(Language)
  .filter((lng) => !FILTERED_LANGUAGES.includes(lng))
  .map((l) => l.toString());

export const ALL_LANGUAGES_ENUM = Object.values(Language).filter(
  (lng) => !FILTERED_LANGUAGES.includes(lng),
);

export const ALL_LANGUAGES_DEFAULT = [Language.ALL_LANGUAGES.toString()].concat(
  ALL_LANGUAGES,
);
