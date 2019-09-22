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
      owner {
        _id
        username
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

export const DELETE_BOARD = gql`
  mutation($boardId: ID!) {
    deleteBoard(boardId: $boardId)
  }
`;
