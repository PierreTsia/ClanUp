import { gql } from "apollo-boost";
export const ALL_TAGS = gql`
  query {
    allTags {
      _id
      label
      color
    }
  }
`;

export const BOARD_TAGS = gql`
  query($boardId: ID!) {
    boardTags(boardId: $boardId) {
      _id
      label
      color
    }
  }
`;

export const ADD_TAG_TO_CARD = gql`
  mutation($tagInput: TagInput!) {
    addTagToCard(tagInput: $tagInput) {
      _id
      title
      tags {
        _id
        label
        color
      }
    }
  }
`;

export const REMOVE_TAG_FROM_CARD = gql`
  mutation($cardId: ID!, $tagId: ID!) {
    removeTagFromCard(tagId: $tagId, cardId: $cardId) {
      _id
      tags {
        _id
        label
        color
      }
    }
  }
`;
