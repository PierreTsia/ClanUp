import * as types from "../mutation-types";
import { defaultClient as apolloClient } from "../../main";
import {
  CREATE_BOARD,
  GET_MYBOARDS,
  DELETE_BOARD,
  GET_BOARD_BY_ID
} from "../../../queries";
import router from "../../router";
export const state = {
  boards: [],
  currentBoard: null,
  error: null
};
export const getters = {
  userHasBoards: state => !!(state.boards && state.boards.length),
  boards: state => state.boards,
  boardError: state => state.error
};

export const actions = {
  getMyBoards: async ({ commit }) => {
    const { data } = await apolloClient.query({
      query: GET_MYBOARDS
    });
    commit(types.SET_BOARDS_SUCCESS, data.getMyBoards);
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
      commit(types.GET_BOARD_BY_ID_ERROR, message);
      await router.push("/");
    }
  }
};

export const mutations = {
  [types.SET_BOARDS_SUCCESS]: (state, boards) => (state.boards = boards),
  [types.CREATE_BOARD_SUCCESS]: (state, board) =>
    (state.boards = [board, ...state.boards]),
  [types.DELETE_BOARD_SUCCES]: (state, boardId) =>
    (state.boards = state.boards.filter(({ _id }) => _id !== boardId)),
  [types.GET_BOARD_BY_ID_SUCCESS]: (state, board) =>
    (state.currentBoard = board),
  [types.GET_BOARD_BY_ID_ERROR]: (state, error) => (state.error = error)
};

export default {
  state,
  getters,
  actions,
  mutations
};
