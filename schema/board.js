const { gql } = require("apollo-server");

const board = gql`
  type Board {
    _id: ID
    boardname: String!
    owner: User!
    contributors: [User]
    description: String
    createdDate: String
    color: String
    coverImg: String
    columns: [Column]
  }

  input BoardInput {
    boardname: String!
    owner: ID!
    description: String
    coverImg: String
    color: String
  }

  extend type Mutation {
    createBoard(boardInput: BoardInput): Board
    deleteBoard(boardId: ID): String
    updateBoard(boardInput: BoardInput!, boardId: ID!): Board
  }

  extend type Query {
    getMyBoards: [Board]
    getBoardById(boardId: ID!): Board
  }
`;

const boardResolvers = {
  Query: {
    getMyBoards: async (_, args, { Board, currentUser }) => {
      if (!currentUser) {
        throw Error("Authentication required");
      }
      try {
        const boards = await Board.find()
          .where({ owner: currentUser })
          .populate([
            {
              path: "columns",
              model: "Column",
              populate: {
                path: "cards",
                model: "Card"
              }
            }
          ])
          .sort({ createdDate: -1 });

        return boards;
      } catch (e) {
        throw Error(e);
      }
    },

    getBoardById: async (_, { boardId }, { Board, Column, currentUser }) => {
      if (!currentUser) {
        throw Error("Authentication required");
      }
      const board = await Board.findById(boardId).populate([
        {
          path: "owner",
          model: "User"
        },
        {
          path: "columns",
          model: "Column",
          populate: {
            path: "cards",
            model: "Card",
            populate: [
              {
                path: "tags",
                model: "Tag"
              },
              {
                path: "columnId",
                model: "Column"
              }
            ]
          }
        }
      ]);
      if (!board) {
        throw Error("No board found");
      }

      if (!board.owner.equals(currentUser._id)) {
        throw Error("Unauthorized");
      }

      return board;
    }
  },

  Mutation: {
    createBoard: async (_, { boardInput }, { Board, currentUser }) => {
      if (!currentUser) {
        throw Error("Only authenticated users can create boards");
      }

      const board = await new Board({
        ...boardInput,
        owner: currentUser._id
      }).save();

      return board;
    },

    deleteBoard: async (_, { boardId }, { Board, Column, currentUser }) => {
      if (!currentUser) {
        throw Error("Authentication required");
      }
      const boardToDelete = await Board.findById(boardId);

      if (!boardToDelete) {
        throw Error(`No board found with id ${boardId}`);
      }
      if (!boardToDelete.owner.equals(currentUser._id)) {
        throw Error("Only owner can delete a board");
      }
      await Column.deleteMany({ boardId });
      await Board.deleteOne({ _id: boardToDelete._id });
      return boardToDelete._id;
    },

    updateBoard: async (
      _,
      { boardInput, boardId },
      { Board, User, currentUser }
    ) => {
      if (!currentUser) {
        return new Error("Unauthorized : must be signed in to modify a board");
      }

      const boardToUpdate = await Board.findById(boardId);

      if (!boardToUpdate) {
        throw Error(`No board found with id ${boardId}`);
      }
      if (!boardToUpdate.owner.equals(currentUser._id)) {
        throw Error("Only owner can update a board");
      }

      const { ...fields } = boardInput;

      // noinspection UnnecessaryLocalVariableJS
      const updatedBoard = await Board.findOneAndUpdate(
        { _id: boardId },
        { ...fields },
        { new: true }
      ).populate([{ path: "owner", model: "User" }]);

      return updatedBoard;
    }
  }
};

module.exports = { board, boardResolvers };
