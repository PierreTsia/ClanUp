import { gql } from "apollo-boost";
export const UPSERT_CARD = gql`
  mutation($cardInput: CardInput!) {
    upsertCard(cardInput: $cardInput) {
      _id
      title
      position
      author {
        _id
      }
      boardId
      columnId {
        _id
      }
    }
  }
`;

export const NORMALIZE_CARDS_ORDER = gql`
  mutation($cardOrderInputs: [CardOrderInput]!) {
    normalizeCardOrder(cardOrderInputs: $cardOrderInputs)
  }
`;
