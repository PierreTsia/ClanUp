import { gql } from "apollo-boost";

export const UPSERT_COLUMN = gql`
  mutation($columnInput: ColumnInput!) {
    upsertColumn(columnInput: $columnInput) {
      _id
      title
      boardId
      position
      author {
        _id
      }
    }
  }
`;

export const NORMALIZE_COLUMNS_ORDER = gql`
  mutation($columnIds: [ID]!) {
    normalizeColumnOrder(columnIds: $columnIds)
  }
`;

export const DELETE_COLUMN = gql`
  mutation($columnId: ID!) {
    deleteColumn(columnId: $columnId)
  }
`;

export const UPDATE_COLUMN_TITLE = gql`
  mutation($columnId: ID!, $title: String!) {
    updateColumnTitle(columnId: $columnId, title: $title) {
      _id
      title
    }
  }
`;
