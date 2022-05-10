import { gql } from "@urql/core";
import { AssistantRecipe } from "../types";

export const getRecipesByShortcut = (
  fingerprint: string,
  shortcut: string,
  language: string
) =>
  gql`{
      getRecipesForClientByShortcut(
        fingerprint: "${fingerprint}",
        term: "${shortcut}",
        dependencies: [],
        language: ${language},
        filename: "javascript.js"
      ){
        shortcut
        code 
        presentableFormat
      }
    }`;

export const getRecipesByShortcutLastTimestamp = (
  fingerprint: string,
  language: string
) => gql`
{
  getRecipesForClientByShortcutLastTimestamp(
    fingerprint: "${fingerprint}",
    dependencies: []
    language: ${language},
  )
}
`;

export type SemanticRecipesResponse = {
  assistantRecipesSemanticSearch: AssistantRecipe[];
};

export const GET_RECIPES_SEMANTIC = gql`
  query assistantRecipesSemanticSearch(
    $term: String
    $language: LanguageEnumeration!
    $howmany: Long!
    $skip: Long!
    $onlyPublic: Boolean
    $onlyPrivate: Boolean
    $onlySubscribed: Boolean
  ) {
    assistantRecipesSemanticSearch(
      term: $term
      languages: [$language]
      howmany: $howmany
      skip: $skip
      onlyPublic: $onlyPublic
      onlyPrivate: $onlyPrivate
      onlySubscribed: $onlySubscribed
    ) {
      id
      name
      description
      isPublic
      keywords
      tags
      code
      imports
      shortcut
      language
      creationTimestampMs
      vscodeFormat
      presentableFormat
      downvotes
      upvotes
      owner {
        username
        accountType
      }
      groups {
        id
        name
      }
    }
  }
`;

export type UserResponse = {
  user: {
    accountType: string;
    username: string;
  }
}

export const GET_USER = gql`
  query getUser {
    user {
      accountType
      username
    }
  }
`;