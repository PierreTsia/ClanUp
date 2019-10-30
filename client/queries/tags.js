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
