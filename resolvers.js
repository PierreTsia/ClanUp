const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { partition } = require("lodash");

const createToken = (user, secret, expiresIn) => {
  const { username, email, _id } = user;
  return jwt.sign({ username, email, _id }, secret, { expiresIn });
};

module.exports = {
  /*
   *
   *
   *   MUTATIONS
   *
   *
   */
  Mutation: {
    //USERS
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
    },

    //BOARDS
    createBoard: async (_, { boardInput }, { User, Board, currentUser }) => {
      console.log("boardInput", boardInput);
      if (!currentUser) {
        throw Error("Only authenticated users can create boards");
      }

      const board = await new Board({
        ...boardInput,
        owner: currentUser._id
      }).save();

      return board;
    }
  },
  /*
   *
   *
   * QUERIES
   *
   *
   * */

  Query: {
    //Users
    isUsernameAvalaible: async (_, { username }, { User }) => {
      try {
        const existingUser = await User.findOne({ username });
        return existingUser ? false : true;
      } catch (e) {
        throw Error(e);
      }
    },
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
    },

    //Boards
    getMyBoards: async (_, args, { Board, currentUser }) => {
      if (!currentUser) {
        throw Error("Authentication required");
      }
      try {
        const boards = await Board.find()
          .where({ owner: currentUser })
          .sort({ createdDate: -1 });

        return boards;
      } catch (e) {
        throw Error(e);
      }
    }
  }
};
