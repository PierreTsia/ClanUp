const { gql } = require("apollo-server");

const card = gql`
  type Card {
    _id: ID
    title: String!
    description: String
    boardId: ID!
    tags: [Tag]
    columnId: Column!
    position: Int!
    author: User
    createdDate: String
    comments: [Comment]
  }
  input TagInput {
    cardId: ID!
    _id: ID!
  }

  type Comment {
    author: User!
    message: String!
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

  extend type Query {
    cardById(cardId: ID!): Card
  }

  extend type Mutation {
    upsertCard(cardInput: CardInput!): Card
    normalizeCardOrder(cardOrderInputs: [CardOrderInput]!): Boolean
    addTagToCard(tagInput: TagInput!): Card
  }
`;

const cardResolvers = {
  Query: {
    cardById: async (_, { cardId }, { currentUser, Card }) => {
      if (!currentUser) {
        throw Error("Authentication required");
      }
      const card = await Card.findById(cardId).populate([
        { path: "columnId", model: "Column" },
        { path: "tags", model: "Tag" }
      ]);
      if (!card) {
        throw Error(`NO card found with id ${cardId}`);
      }
      return card;
    }
  },
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

    addTagToCard: async (_, { tagInput }, { currentUser, Card, Tag }) => {
      if (!currentUser) {
        throw Error("Authentication required");
      }

      const { cardId, _id } = tagInput;
      const card = await Card.findById(cardId);
      if (!card) {
        throw Error(`No card found with id ${cardId}`);
      }

      if (!card.author.equals(currentUser._id)) {
        throw Error("Only owner can update a card");
      }

      const savedCard = await Card.findOneAndUpdate(
        { _id: cardId },
        { $addToSet: { tags: { _id } } },
        { new: true }
      ).populate([
        { path: "author", model: "User" },
        { path: "tags", model: "Tag" }
      ]);

      return savedCard;
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
