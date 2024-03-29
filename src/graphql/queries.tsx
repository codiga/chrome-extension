import { gql } from "@urql/core";
import { AssistantRecipe } from "../lib/types";

export const getRecipesByShortcut = (
  fingerprint: string,
  shortcut: string,
  language: string,
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
  language: string,
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
      isSubscribed
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
        displayName
        hasSlug
        slug
      }
      groups {
        id
        name
      }
      cookbook {
        id
        name
        isSubscribed
      }
    }
  }
`;

export type UserResponse = {
  user: {
    username: string;
    hasSlug: boolean;
    slug?: string;
  };
};

export const GET_USER = gql`
  query getUser {
    user {
      username
      hasSlug
      slug
    }
  }
`;
