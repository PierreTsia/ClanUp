import { gql } from "apollo-boost";

export const GET_MYBOARDS = gql`
  query {
    getMyBoards {
      _id
      boardname
      coverImg
      color
      createdDate
    }
  }
`;

export const GET_BOARD_BY_ID = gql`
  query($boardId: ID!) {
    getBoardById(boardId: $boardId) {
      _id
      boardname
      description
      createdDate
      color
      coverImg
      owner {
        _id
        username
      }
      columns {
        _id
        title
        position
      }
    }
  }
`;

export const CREATE_BOARD = gql`
  mutation($boardinput: BoardInput) {
    createBoard(boardInput: $boardinput) {
      _id
      boardname
      description
      coverImg
      color
      createdDate
      owner {
        _id
      }
    }
  }
`;

export const UPDATE_BOARD = gql`
  mutation($boardId: ID!, $boardInput: BoardInput!) {
    updateBoard(boardId: $boardId, boardInput: $boardInput) {
      _id
      boardname
      color
      coverImg
      description
      createdDate
      owner {
        _id
        username
      }
    }
  }
`;

export const DELETE_BOARD = gql`
  mutation($boardId: ID!) {
    deleteBoard(boardId: $boardId)
  }
`;

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
