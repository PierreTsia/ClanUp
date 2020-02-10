const { gql } = require("apollo-server");
const { omit } = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createToken = (user, secret, expiresIn) => {
  const { username, email, _id } = user;
  return jwt.sign({ username, email, _id }, secret, { expiresIn });
};

const user = gql`
  type User {
    _id: ID
    username: String!
    email: String!
    password: String!
    avatar: String
    joinDate: String
  }

  type Token {
    token: String!
  }
  type UserOutput {
    token: String!
    user: User
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  type Mutation {
    signupUser(userInput: UserInput): Token
    signinUser(email: String!, password: String!): UserOutput
  }

  type Query {
    getCurrentUser: User
    isUsernameAvalaible(username: String!): Boolean
  }
`;

const userResolvers = {
  Query: {
    getCurrentUser: async (_, args, { User, currentUser }) => {
      if (!currentUser) {
        return null;
      }
      try {
        const user = await User.findById(currentUser._id);
        return user;
      } catch (e) {
        throw Error(e);
      }
    }
  },
  Mutation: {
    signupUser: async (_, { userInput }, { User }) => {
      const existingUser = await User.findOne({ username: userInput.username });
      if (existingUser) {
        throw new Error("User already exists");
      }

      const user = await new User({
        ...userInput
      }).save();
      return { token: createToken(user, process.env.SECRET, "12hr") };
    },

    signinUser: async (_, { email, password }, { User }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error(`No user found`);
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Password is incorrect");
      }
      return {
        token: createToken(user, process.env.SECRET, "1hr"),
        user
      };
    }
  }
};
module.exports = { user, userResolvers };
