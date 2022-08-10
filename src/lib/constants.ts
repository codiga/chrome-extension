export const CREATE_RECIPE_FROM_SELECTION = "CREATE_RECIPE_FROM_SELECTION";
export const BASE_URL = "https://app.codiga.io";
export const API_URL = "https://api.codiga.io/graphql";
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

export const LANGUAGE_APEX_KEY = "Apex";
export const LANGUAGE_CPP_KEY = "Cpp";
export const LANGUAGE_COLDFUSION_KEY = "Coldfusion";
export const LANGUAGE_C_KEY = "C";
export const LANGUAGE_CSS_KEY = "Css";
export const LANGUAGE_CSHARP_KEY = "Csharp";
export const LANGUAGE_DART_KEY = "Dart";
export const LANGUAGE_DOCKER_KEY = "Docker";
export const LANGUAGE_SQL_KEY = "Sql";
export const LANGUAGE_GO_KEY = "Go";
export const LANGUAGE_GRADLE_KEY = "Gradle";
export const LANGUAGE_HASKELL_KEY = "Haskell";
export const LANGUAGE_JAVA_KEY = "Java";
export const LANGUAGE_JAVASCRIPT_KEY = "Javascript";
export const LANGUAGE_JSON_KEY = "Json";
export const LANGUAGE_KOTLIN_KEY = "Kotlin";
export const LANGUAGE_OBJECTIVEC_KEY = "Objectivec";
export const LANGUAGE_PHP_KEY = "Php";
export const LANGUAGE_PYTHON_KEY = "Python";
export const LANGUAGE_RUBY_KEY = "Ruby";
export const LANGUAGE_SCALA_KEY = "Scala";
export const LANGUAGE_SHELLSCRIPT_KEY = "Shell";
export const LANGUAGE_SOLIDITY_KEY = "Solidity";
export const LANGUAGE_SWIFT_KEY = "Swift";
export const LANGUAGE_TERRAFORM_KEY = "Terraform";
export const LANGUAGE_TYPESCRIPT_KEY = "Typescript";
export const LANGUAGE_YAML_KEY = "Yaml";
export const LANGUAGE_HTML_KEY = "Html";
export const LANGUAGE_RUST_KEY = "Rust";

export const LANGUAGE_APEX_LABEL = "Apex";
export const LANGUAGE_CPP_LABEL = "C++";
export const LANGUAGE_COLDFUSION_LABEL = "Coldfusion";
export const LANGUAGE_C_LABEL = "C";
export const LANGUAGE_CSS_LABEL = "CSS";
export const LANGUAGE_CSHARP_LABEL = "C#";
export const LANGUAGE_DART_LABEL = "Dart";
export const LANGUAGE_DOCKER_LABEL = "Docker";
export const LANGUAGE_SQL_LABEL = "SQL";
export const LANGUAGE_GO_LABEL = "Go";
export const LANGUAGE_GRADLE_LABEL = "Gradle";
export const LANGUAGE_HASKELL_LABEL = "Haskell";
export const LANGUAGE_JAVA_LABEL = "Java";
export const LANGUAGE_JAVASCRIPT_LABEL = "JavaScript";
export const LANGUAGE_JSON_LABEL = "JSON";
export const LANGUAGE_KOTLIN_LABEL = "Kotlin";
export const LANGUAGE_OBJECTIVEC_LABEL = "Objective-C";
export const LANGUAGE_PHP_LABEL = "PHP";
export const LANGUAGE_PYTHON_LABEL = "Python";
export const LANGUAGE_RUBY_LABEL = "Ruby";
export const LANGUAGE_SCALA_LABEL = "Scala";
export const LANGUAGE_SHELLSCRIPT_LABEL = "Shell";
export const LANGUAGE_SOLIDITY_LABEL = "Solidity";
export const LANGUAGE_SWIFT_LABEL = "Swift";
export const LANGUAGE_TERRAFORM_LABEL = "Terraform";
export const LANGUAGE_TYPESCRIPT_LABEL = "TypeScript";
export const LANGUAGE_YAML_LABEL = "YAML";
export const LANGUAGE_HTML_LABEL = "HTML";
export const LANGUAGE_RUST_LABEL = "Rust";

export const LANGUAGE_LABEL_MAP = {
  [LANGUAGE_APEX_KEY]: LANGUAGE_APEX_LABEL,
  [LANGUAGE_CPP_KEY]: LANGUAGE_CPP_LABEL,
  [LANGUAGE_COLDFUSION_KEY]: LANGUAGE_COLDFUSION_LABEL,
  [LANGUAGE_C_KEY]: LANGUAGE_C_LABEL,
  [LANGUAGE_CSS_KEY]: LANGUAGE_CSS_LABEL,
  [LANGUAGE_CSHARP_KEY]: LANGUAGE_CSHARP_LABEL,
  [LANGUAGE_DART_KEY]: LANGUAGE_DART_LABEL,
  [LANGUAGE_DOCKER_KEY]: LANGUAGE_DOCKER_LABEL,
  [LANGUAGE_SQL_KEY]: LANGUAGE_SQL_LABEL,
  [LANGUAGE_GO_KEY]: LANGUAGE_GO_LABEL,
  [LANGUAGE_GRADLE_KEY]: LANGUAGE_GRADLE_LABEL,
  [LANGUAGE_HASKELL_KEY]: LANGUAGE_HASKELL_LABEL,
  [LANGUAGE_JAVA_KEY]: LANGUAGE_JAVA_LABEL,
  [LANGUAGE_JAVASCRIPT_KEY]: LANGUAGE_JAVASCRIPT_LABEL,
  [LANGUAGE_JSON_KEY]: LANGUAGE_JSON_LABEL,
  [LANGUAGE_KOTLIN_KEY]: LANGUAGE_KOTLIN_LABEL,
  [LANGUAGE_OBJECTIVEC_KEY]: LANGUAGE_OBJECTIVEC_LABEL,
  [LANGUAGE_PHP_KEY]: LANGUAGE_PHP_LABEL,
  [LANGUAGE_PYTHON_KEY]: LANGUAGE_PYTHON_LABEL,
  [LANGUAGE_RUBY_KEY]: LANGUAGE_RUBY_LABEL,
  [LANGUAGE_SCALA_KEY]: LANGUAGE_SCALA_LABEL,
  [LANGUAGE_SHELLSCRIPT_KEY]: LANGUAGE_SHELLSCRIPT_LABEL,
  [LANGUAGE_SOLIDITY_KEY]: LANGUAGE_SOLIDITY_LABEL,
  [LANGUAGE_SWIFT_KEY]: LANGUAGE_SWIFT_LABEL,
  [LANGUAGE_TERRAFORM_KEY]: LANGUAGE_TERRAFORM_LABEL,
  [LANGUAGE_TYPESCRIPT_KEY]: LANGUAGE_TYPESCRIPT_LABEL,
  [LANGUAGE_YAML_KEY]: LANGUAGE_YAML_LABEL,
  [LANGUAGE_HTML_KEY]: LANGUAGE_HTML_LABEL,
  [LANGUAGE_RUST_KEY]: LANGUAGE_RUST_LABEL,
};

export const LANGUAGES_ALL = [
  [LANGUAGE_PYTHON_KEY],
  [LANGUAGE_TYPESCRIPT_KEY],
  [LANGUAGE_JAVASCRIPT_KEY],
  [LANGUAGE_APEX_KEY],
  [LANGUAGE_CPP_KEY],
  [LANGUAGE_COLDFUSION_KEY],
  [LANGUAGE_C_KEY],
  [LANGUAGE_CSS_KEY],
  [LANGUAGE_CSHARP_KEY],
  [LANGUAGE_DART_KEY],
  [LANGUAGE_DOCKER_KEY],
  [LANGUAGE_SQL_KEY],
  [LANGUAGE_GO_KEY],
  [LANGUAGE_GRADLE_KEY],
  [LANGUAGE_HASKELL_KEY],
  [LANGUAGE_JAVA_KEY],
  [LANGUAGE_JSON_KEY],
  [LANGUAGE_KOTLIN_KEY],
  [LANGUAGE_OBJECTIVEC_KEY],
  [LANGUAGE_PHP_KEY],
  [LANGUAGE_RUBY_KEY],
  [LANGUAGE_SCALA_KEY],
  [LANGUAGE_SHELLSCRIPT_KEY],
  [LANGUAGE_SOLIDITY_KEY],
  [LANGUAGE_SWIFT_KEY],
  [LANGUAGE_TERRAFORM_KEY],
  [LANGUAGE_YAML_KEY],
  [LANGUAGE_HTML_KEY],
  [LANGUAGE_RUST_KEY],
];

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
