import * as types from "../mutation-types";
import { defaultClient as apolloClient } from "../../main";
import { NORMALIZE_CARDS_ORDER, UPSERT_CARD } from "../../../queries";

export const state = {
  currentBoardCards: [],
  error: null
};
export const getters = {
  currentBoardCards: state => state.currentBoardCards
};

export const actions = {
  upsertCard: async ({ commit }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: UPSERT_CARD,
        variables: payload
      });
      commit(types.UPSERT_CARD_SUCCESS, data.upsertCard);
    } catch (e) {
      console.warn(e);
    }
  },
  normalizeCardOrder: async ({ commit }, payload) => {
    try {
      await apolloClient.mutate({
        mutation: NORMALIZE_CARDS_ORDER,
        variables: payload
      });
      commit(types.RESET_BOARD_CARDS);
    } catch (e) {
      console.warn(e);
    }
  }
};

export const mutations = {
  [types.GET_BOARD_BY_ID_SUCCESS]: (state, board) => {
    const { columns } = board;
    state.currentBoardCards = columns.flatMap(({ cards }) => cards);
  },
  [types.RESET_BOARD_CARDS]: state => (state.currentBoardCards = []),
  [types.UPSERT_CARD_SUCCESS]: (state, newCard) => {
    if (!state.currentBoardCards.some(c => c._id === newCard._id)) {
      state.currentBoardCards.push(newCard);
    } else {
      const index = state.currentBoardCards.findIndex(
        c => c._id === newCard._id
      );
      state.currentBoardCards[index] = newCard;
    }
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
