const { gql } = require("apollo-server");

const tag = gql`
  type Tag {
    _id: ID
    label: String
    color: String
  }

  extend type Query {
    allTags: [Tag]
  }
  extend type Mutation {
    upsertTag(_id: ID, label: String!, color: String): Tag
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
    }
  },
  Mutation: {
    upsertTag: async (_, { _id, label, color }, { currentUser, Tag }) => {
      if (!currentUser) {
        throw Error("Authentication required");
      }

      if (!_id) {
        const newTag = await new Tag({ label, color }).save();
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
