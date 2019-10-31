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
