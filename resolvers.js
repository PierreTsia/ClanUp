const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { partition } = require("lodash");

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

module.exports = {
  /*
  |--------------------------------------------------------------------------
  |                     MUTATION   POSTS
  |--------------------------------------------------------------------------
  */
  Mutation: {
    signupUser: async (_, { username, email, password }, { User }) => {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new Error("User already exists");
      }

      const user = await new User({
        username,
        email,
        password
      }).save();
      return { token: createToken(user, process.env.SECRET, "1hr") };
    },

    signinUser: async (_, { email, password }, { User }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error(`No user found with email ${email}`);
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Password is incorrect");
      }
      return { token: createToken(user, process.env.SECRET, "1hr") };
    }
  },
  Query: {
    isUsernameAvalaible: async (_, { username }, { User }) => {
      const existingUser = await User.findOne({ username });
      return existingUser ? false : true;
    },
    getCurrentUser: async (_, args, { User, currentUser }) => {
      if (!currentUser) {
        return null;
      }
      const user = await User.findOne({
        email: currentUser.email
      });
      return user;
    }
  }
};
