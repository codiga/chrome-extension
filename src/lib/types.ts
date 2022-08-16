import { Language } from "./constants";

export type Position = {
  x: number;
  y: number;
};

export type Dimensions = {
  width: number;
  height: number;
};

export type AssistantRecipe = {
  id: number;
  shortcut: string;
  code: string;
  presentableFormat: string;
  name: string;
  description: string;
  isPublic: boolean;
  isSubscribed: boolean;
  owner: {
    displayName: string;
    hasSlug: boolean;
    slug?: string;
  };
  groups: {
    id: number;
    name: string;
  }[];
  cookbook?: {
    id: number;
    name: string;
    isSubscribed: boolean;
  };
};

export type ShortcutContext = {
  code: string;
  recipes: AssistantRecipe[];
  activeLineIndex: number;
};

export type LanguageEnumeration =
  | Language.LANGUAGE_UNKNOWN
  | Language.LANGUAGE_VISUAL
  | Language.LANGUAGE_DOCKER
  | Language.LANGUAGE_OBJECTIVE_C
  | Language.LANGUAGE_TERRAFORM
  | Language.LANGUAGE_JSON
  | Language.LANGUAGE_YAML
  | Language.LANGUAGE_TYPESCRIPT
  | Language.LANGUAGE_SWIFT
  | Language.LANGUAGE_SOLIDITY
  | Language.LANGUAGE_SQL
  | Language.LANGUAGE_SHELL
  | Language.LANGUAGE_SCALA
  | Language.LANGUAGE_RUST
  | Language.LANGUAGE_RUBY
  | Language.LANGUAGE_PHP
  | Language.LANGUAGE_PYTHON
  | Language.LANGUAGE_PERL
  | Language.LANGUAGE_KOTLIN
  | Language.LANGUAGE_JAVASCRIPT
  | Language.LANGUAGE_JAVA
  | Language.LANGUAGE_HTML
  | Language.LANGUAGE_HASKELL
  | Language.LANGUAGE_GO
  | Language.LANGUAGE_DART
  | Language.LANGUAGE_CSHARP
  | Language.LANGUAGE_CSS
  | Language.LANGUAGE_CPP
  | Language.LANGUAGE_PASCAL
  | Language.LANGUAGE_REACT
  | Language.LANGUAGE_C
  | Language.LANGUAGE_APEX
  | Language.ALL_LANGUAGES;
