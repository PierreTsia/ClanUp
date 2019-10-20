const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    signupUser: async (_, { userInput }, { User }) => {
      const existingUser = await User.findOne({ username: userInput.username });
      if (existingUser) {
        throw new Error("User already exists");
      }

      const user = await new User({
        ...userInput
      }).save();
      return { token: createToken(user, process.env.SECRET, "1hr") };
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
      return { token: createToken(user, process.env.SECRET, "1hr") };
    },

    //BOARDS
    createBoard: async (_, { boardInput }, { Board, currentUser }) => {
      if (!currentUser) {
        throw Error("Only authenticated users can create boards");
      }

      const board = await new Board({
        ...boardInput,
        owner: currentUser._id
      }).save();

      return board;
    },

    deleteBoard: async (_, { boardId }, { Board, Column, currentUser }) => {
      if (!currentUser) {
        throw Error("Authentication required");
      }
      const boardToDelete = await Board.findById(boardId);

      if (!boardToDelete) {
        throw Error(`No board found with id ${boardId}`);
      }
      if (!boardToDelete.owner.equals(currentUser._id)) {
        throw Error("Only owner can delete a board");
      }
      await Column.deleteMany({ boardId });
      await Board.deleteOne({ _id: boardToDelete._id });
      return boardToDelete._id;
    },

    updateBoard: async (
      _,
      { boardInput, boardId },
      { Board, User, currentUser }
    ) => {
      if (!currentUser) {
        return new Error("Unauthorized : must be signed in to modify a board");
      }

      const boardToUpdate = await Board.findById(boardId);

      if (!boardToUpdate) {
        throw Error(`No board found with id ${boardId}`);
      }
      if (!boardToUpdate.owner.equals(currentUser._id)) {
        throw Error("Only owner can update a board");
      }

      const { ...fields } = boardInput;

      // noinspection UnnecessaryLocalVariableJS
      const updatedBoard = await Board.findOneAndUpdate(
        { _id: boardId },
        { ...fields },
        { new: true }
      ).populate([{ path: "owner", model: "User" }]);

      return updatedBoard;
    },

    //COLUMNS
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
    },

    normalizeCardOrder: async (
      _,
      { cardOrderInputs },
      { Card, currentUser }
    ) => {
      if (!currentUser) {
        throw Error("Authentication required");
      }
      for (const { _id, position } of cardOrderInputs) {
        await Card.findOneAndUpdate(
          { _id },
          { position },
          { new: true }
        );
      }
    },

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

    //CARDS
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
          .populate([
            {
              path: "columns",
              model: "Column",
              populate: {
                path: "cards",
                model: "Card"
              }
            }
          ])
          .sort({ createdDate: -1 });

        return boards;
      } catch (e) {
        throw Error(e);
      }
    },

    getBoardById: async (_, { boardId }, { Board, Column, currentUser }) => {
      if (!currentUser) {
        throw Error("Authentication required");
      }
      const board = await Board.findById(boardId).populate([
        {
          path: "owner",
          model: "User"
        },
        {
          path: "columns",
          model: "Column",
          populate: { path: "cards", model: "Card" }
        }
      ]);
      if (!board) {
        throw Error("No board found");
      }

      if (!board.owner.equals(currentUser._id)) {
        throw Error("Unauthorized");
      }

      return board;
    }
  }

  //Columns
};
