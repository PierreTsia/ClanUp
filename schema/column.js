const { gql } = require("apollo-server");

const column = gql`
  type Column {
    _id: ID
    title: String!
    position: Int!
    boardId: ID!
    author: User
    cards: [Card]
    createdDate: String
  }

  input ColumnInput {
    _id: ID
    title: String!
    boardId: ID!
    position: Int!
    createdDate: String
  }

  extend type Mutation {
    upsertColumn(columnInput: ColumnInput!): Column
    updateColumnTitle(columnId: ID!, title: String!): Column
    normalizeColumnOrder(columnIds: [ID]!): Boolean
    deleteColumn(columnId: ID!): ID
  }
`;

const columnResolvers = {
  Query: {},
  Mutation: {
    updateColumnTitle: async (
      _,
      { columnId, title },
      { Column, currentUser }
    ) => {
      if (!currentUser) {
        throw Error("Authentication required");
      }

      const columnToUpdate = await Column.findById(columnId);

      if (!columnToUpdate) {
        throw Error("No list found");
      }

      if (!columnToUpdate.author.equals(currentUser._id)) {
        throw Error("Only author can make updates");
      }

      const updatedColumn = await Column.findOneAndUpdate(
        { _id: columnId },
        { title },
        { new: true }
      ).populate([{ path: "author", model: "User" }]);

      return updatedColumn;
    },

    upsertColumn: async (
      _,
      { columnInput },
      { currentUser, Board, Column }
    ) => {
      if (!currentUser) {
        throw Error("Authentication required");
      }

      const board = await Board.findById(columnInput.boardId);

      if (!board) {
        throw Error(`No board found with id ${columnInput.boardId}`);
      }

      if (!board.owner.equals(currentUser._id)) {
        throw Error("Only owner can update a board");
      }

      if (columnInput._id) {
        const columnToUpdate = await Column.findById(columnInput._id);
        if (!columnToUpdate) {
          throw Error(`No Column found with id ${columnInput._id}`);
        }

        const { _id, ...fields } = columnInput;
        const updatedColumn = await Column.findOneAndUpdate(
          { _id },
          { ...fields },
          { new: true }
        ).populate([{ path: "author", model: "User" }]);

        return updatedColumn;
      } else {
        const newColumn = await new Column({
          ...columnInput,
          author: currentUser._id
        }).save();

        await Board.findOneAndUpdate(
          { _id: columnInput.boardId },
          { $addToSet: { columns: newColumn._id } },
          { new: true }
        );

        return newColumn;
      }
    },

    deleteColumn: async (_, { columnId }, { Column, Board, currentUser }) => {
      if (!currentUser) {
        throw Error("Authentication required");
      }

      const columnToDelete = await Column.findById(columnId);

      if (!columnToDelete) {
        throw Error("No column found");
      }

      const board = await Board.findById(columnToDelete.boardId);

      if (!board) {
        throw Error("No board found");
      }

      if (!board.owner.equals(currentUser._id)) {
        throw Error("Only owner can update a board");
      }

      const deleted = await Column.deleteOne({ _id: columnId });
      if (deleted) {
        return columnId;
      }
    },
    normalizeColumnOrder: async (_, { columnIds }, { currentUser, Column }) => {
      if (!currentUser) {
        throw Error("Authentication required");
      }
      const MAGIC_NUMBER = 1000000;

      for (const [i, colId] of columnIds.entries()) {
        const newPosition = (i + 1) * MAGIC_NUMBER;
        await Column.findOneAndUpdate(
          { _id: colId },
          { position: newPosition },
          { new: true }
        );
      }
    }
  }
};

module.exports = { column, columnResolvers };
