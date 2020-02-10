import { gql } from "apollo-boost";

export const GET_MYBOARDS = gql`
  query {
    getMyBoards {
      _id
      boardname
      coverImg
      color
      createdDate
      columns {
        _id
        title
        cards {
          _id
          title
          description
          position
        }
      }
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
        cards {
          _id
          title
          coverImg
          tags {
            _id
            label
            color
          }
          comments {
            author {
              _id
            }
          }
          description
          position
          columnId {
            _id
            title
          }
        }
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
