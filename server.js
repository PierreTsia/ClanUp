require("dotenv").config({ path: "variables.env" });
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Board = require("./models/Board");
const Column = require("./models/Column");
const Card = require("./models/Card");

const filePath = path.join(__dirname, "typeDefs.graphql");
const typeDefs = fs.readFileSync(filePath, "utf-8");
const resolvers = require("./resolvers");
const { ApolloServer, gql, AuthenticationError } = require("apollo-server");
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("💾 💾 Database connected");
  })
  .catch(e => {
    console.log(e);
  });

const getUser = async token => {
  if (token) {
    try {
      let user = await jwt.verify(token, process.env.SECRET);
      return user;
    } catch (e) {
      throw new AuthenticationError(
        "🚷Invalid Token : your session has expired. Please sign in again."
      );
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => ({
    name: error.name,
    message: error.message.replace("Context creation failed:", "")
  }),
  context: async ({ req }) => ({
    currentUser: await getUser(req.headers.authorization),
    User,
    Board,
    Card,
    Column
  })
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🤖🤖 Server listening on ${url}`);
});
