const { gql } = require("apollo-server");

const card = gql`
  type Card {
    _id: ID
    title: String!
    description: String
    boardId: ID!
    columnId: Column!
    position: Int!
    author: User
    createdDate: String
  }
  input CardInput {
    _id: ID
    title: String!
    description: String
    boardId: ID!
    columnId: ID!
    position: Int!
    createdDate: String
  }
  input CardOrderInput {
    _id: ID!
    columnId: ID!
    position: Int!
  }
  extend type Mutation {
    upsertCard(cardInput: CardInput!): Card
    normalizeCardOrder(cardOrderInputs: [CardOrderInput]!): Boolean
  }
`;

const cardResolvers = {
  Mutation: {
    normalizeCardOrder: async (
      _,
      { cardOrderInputs },
      { Card, currentUser }
    ) => {
      if (!currentUser) {
        throw Error("Authentication required");
      }
      for (const { _id, position } of cardOrderInputs) {
        await Card.findOneAndUpdate({ _id }, { position }, { new: true });
      }
    },
    upsertCard: async (
      _,
      { cardInput },
      { currentUser, Board, Card, Column }
    ) => {
      if (!currentUser) {
        throw Error("Authentication required");
      }

      const board = await Board.findById(cardInput.boardId);

      if (!board) {
        throw Error(`No board found with id ${cardInput.boardId}`);
      }

      if (!board.owner.equals(currentUser._id)) {
        throw Error("Only owner can update a board");
      }

      const column = await Column.findById(cardInput.columnId);

      if (!column) {
        throw Error(`No column found with id ${cardInput.columnId}`);
      }

      if (cardInput._id) {
        const cardToUpdate = await Card.findById(cardInput._id);
        if (!cardToUpdate) {
          throw Error(`No Column found with id ${cardInput._id}`);
        }

        const { _id, ...fields } = cardInput;
        const updatedCard = await Card.findOneAndUpdate(
          { _id },
          { ...fields },
          { new: true }
        ).populate([
          { path: "author", model: "User" },
          { path: "columnId", label: "Column" }
        ]);

        return updatedCard;
      } else {
        const newCard = await new Card({
          ...cardInput,
          author: currentUser._id
        }).save();

        await Column.findOneAndUpdate(
          { _id: cardInput.columnId },
          { $addToSet: { cards: newCard._id } },
          { new: true }
        ).populate([
          { path: "author", model: "User" },
          { path: "columnId", model: "Column" }
        ]);

        return newCard;
      }
    }
  }
};

module.exports = { card, cardResolvers };
