import { gql } from "@urql/core";

export const SUBSCRIBE_TO_RECIPE = gql`
  mutation subscribeToRecipe($id: Long!) {
    subscribeToRecipe(id: $id)
  }
`;

export const UNSUBSCRIBE_FROM_RECIPE = gql`
  mutation unsubscribeFromRecipe($id: Long!) {
    unsubscribeFromRecipe(id: $id)
  }
`;
