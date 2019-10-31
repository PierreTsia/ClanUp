const { gql } = require("apollo-server");
const { sortBy } = require("lodash");

const tag = gql`
  type Tag {
    _id: ID
    label: String
    color: String
    board: ID
  }

  extend type Query {
    allTags: [Tag]
    boardTags(boardId: ID!): [Tag]
  }
  extend type Mutation {
    upsertTag(_id: ID, label: String!, color: String!, board: ID): Tag
    deleteTag(_id: ID!): Boolean
  }
`;

const tagResolvers = {
  Query: {
    allTags: async (_, args, { currentUser, Tag }) => {
      if (!currentUser) {
        throw Error("Authentication required");
      }
      const tags = await Tag.find();
      return tags;
    },
    boardTags: async (_, { boardId }, { currentUser, Tag }) => {
      if (!currentUser) {
        throw Error("Authentication required");
      }
      const tags = await Tag.find({
        $or: [{ board: boardId }, { board: null }]
      });
      return sortBy(tags, tag => tag.board);
    }
  },
  Mutation: {
    upsertTag: async (
      _,
      { _id, label, color, board },
      { currentUser, Tag }
    ) => {
      if (!currentUser) {
        throw Error("Authentication required");
      }

      if (!_id) {
        const newTag = await new Tag({ label, color, board }).save();
        return newTag;
      }
    },
    deleteTag: async (_, { _id }, { Tag, currentUser }) => {
      if (!currentUser) {
        throw Error("Authentication required");
      }
      await Tag.deleteOne({ _id });
      return true;
    }
  }
};

module.exports = { tag, tagResolvers };
