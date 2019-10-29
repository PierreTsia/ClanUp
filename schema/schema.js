const { makeExecutableSchema } = require("apollo-server");
const { merge } = require("lodash");
const { board, boardResolvers } = require("./board");
const { user, userResolvers } = require("./user");
const { column, columnResolvers } = require("./column");
const { card, cardResolvers } = require("./card");
const { tag, tagResolvers } = require("./tag");

const schema = makeExecutableSchema({
  typeDefs: [board, user, column, card, tag],
  resolvers: merge(
    boardResolvers,
    userResolvers,
    columnResolvers,
    cardResolvers,
    tagResolvers
  )
});

module.exports = schema;
