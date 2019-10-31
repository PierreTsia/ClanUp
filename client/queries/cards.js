import { gql } from "apollo-boost";
export const UPSERT_CARD = gql`
  mutation($cardInput: CardInput!) {
    upsertCard(cardInput: $cardInput) {
      _id
      title
      description
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

export const CARD_BY_ID = gql`
  query($cardId: ID!) {
    cardById(cardId: $cardId) {
      _id
      title
      position
      description
      columnId {
        _id
        title
      }
      comments {
        author {
          _id
          username
        }
      }
      tags {
        _id
        label
        color
      }
    }
  }
`;
