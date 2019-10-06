import * as types from "../mutation-types";
import { sortBy } from "lodash";
import { defaultClient as apolloClient } from "../../main";
import {
  CREATE_BOARD,
  GET_MYBOARDS,
  DELETE_BOARD,
  GET_BOARD_BY_ID,
  UPDATE_BOARD,
  UPSERT_COLUMN,
  NORMALIZE_COLUMNS_ORDER
} from "../../../queries";
import router from "../../router";
export const state = {
  boards: [],
  currentBoard: null,
  currentBoardColumns: [],
  error: null
};
export const getters = {
  userHasBoards: state => !!(state.boards && state.boards.length),
  boards: state => state.boards,
  boardError: state => state.error,
  currentBoard: state => state.currentBoard,
  boardColumns: state =>
    state.currentBoardColumns.length > 1
      ? sortBy(state.currentBoardColumns, "position")
      : state.currentBoardColumns
};

export const actions = {
  getMyBoards: async ({ commit }) => {
    try {
      const { data } = await apolloClient.query({
        query: GET_MYBOARDS
      });
      console.log("data", data);
      commit(types.SET_BOARDS_SUCCESS, data.getMyBoards);
    } catch ({ message }) {
      console.warn(message);
      commit(types.GET_BOARDS_ERROR, message);
    }
  },
  createBoard: async ({ commit }, boardInput) => {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_BOARD,
      variables: boardInput
    });
    commit(types.CREATE_BOARD_SUCCESS, data.createBoard);
  },
  deleteBoardById: async ({ commit }, boardId) => {
    const { data } = await apolloClient.mutate({
      mutation: DELETE_BOARD,
      variables: { boardId }
    });

    commit(types.DELETE_BOARD_SUCCES, data.deleteBoard);
  },
  getBoardById: async ({ commit }, boardId) => {
    try {
      const { data } = await apolloClient.query({
        query: GET_BOARD_BY_ID,
        variables: { boardId }
      });

      commit(types.GET_BOARD_BY_ID_SUCCESS, data.getBoardById);
    } catch ({ message }) {
      commit(types.SET_BOARD_ERROR, message);
      await router.push("/");
    }
  },

  updateBoard: async ({ commit }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_BOARD,
        variables: payload
      });
      commit(types.SET_CURRENT_BOARD, data.updateBoard);
    } catch (e) {
      commit(types.SET_BOARD_ERROR, e);
    }
  },
  upsertColumn: async ({ commit }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: UPSERT_COLUMN,
        variables: payload
      });
      commit(types.UPSERT_COLUMN_SUCCESS, data.upsertColumn);
    } catch (e) {
      console.warn(e);
    }
  },

  normalizeColumnOrder: async (_, payload) => {
    try {
      await apolloClient.mutate({
        mutation: NORMALIZE_COLUMNS_ORDER,
        variables: payload
      });
    } catch (e) {
      console.warn(e);
    }
  }
};

export const mutations = {
  [types.SET_BOARDS_SUCCESS]: (state, boards) => {
    state.boards = boards;
  },
  [types.CREATE_BOARD_SUCCESS]: (state, board) =>
    (state.boards = [board, ...state.boards]),
  [types.DELETE_BOARD_SUCCES]: (state, boardId) =>
    (state.boards = state.boards.filter(({ _id }) => _id !== boardId)),
  [types.GET_BOARD_BY_ID_SUCCESS]: (state, board) => {
    const { columns } = board;
    state.currentBoardColumns = columns;
    state.currentBoard = board;
  },
  [types.SET_BOARD_ERROR]: (state, error) => (state.error = error),
  [types.SET_CURRENT_BOARD]: (state, board) => {
    state.currentBoard = board;
    const index = state.boards.findIndex(b => b._id === board._id);
    state.boards[index] = board;
  },
  [types.GET_BOARDS_ERROR]: (state, errorMsg) => (state.error = errorMsg),
  [types.UPSERT_COLUMN_SUCCESS]: (state, column) => {
    const columnToUpdate = state.currentBoardColumns.find(
      c => c._id === column._id
    );
    if (!columnToUpdate) {
      state.currentBoardColumns = [...state.currentBoardColumns, column];
    } else {
      state.currentBoardColumns = [
        ...state.currentBoardColumns.filter(c => c._id !== column._id),
        column
      ];
    }
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
