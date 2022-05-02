import { gql } from "@urql/core";

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
