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
