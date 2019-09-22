import * as types from "../mutation-types";
import { defaultClient as apolloClient } from "../../main";
import { CREATE_BOARD, GET_MYBOARDS } from "../../../queries";
export const state = {
  boards: []
};
export const getters = {
  userHasBoards: state => !!(state.boards && state.boards.length),
  boards: state => state.boards
};

export const actions = {
  getMyBoards: async ({ commit }) => {
    const { data } = await apolloClient.query({
      query: GET_MYBOARDS
    });
    commit(types.SET_BOARDS_SUCCESS, data.getMyBoards);
  },
  createBoard: async ({ commit }, boardInput) => {
    console.log("payload", boardInput);
    const { data } = await apolloClient.mutate({
      mutation: CREATE_BOARD,
      variables: boardInput
    });
    commit(types.CREATE_BOARD_SUCCESS, data.createBoard);
  }
};

export const mutations = {
  [types.SET_BOARDS_SUCCESS]: (state, boards) => (state.boards = boards),
  [types.CREATE_BOARD_SUCCESS]: (state, board) =>
    (state.boards = [board, ...state.boards])
};

export default {
  state,
  getters,
  actions,
  mutations
};
