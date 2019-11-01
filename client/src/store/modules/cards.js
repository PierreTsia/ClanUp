import * as types from "../mutation-types";
import { defaultClient as apolloClient } from "../../main";
import {
  CARD_BY_ID,
  NORMALIZE_CARDS_ORDER,
  UPSERT_CARD
} from "../../../queries";
import { flatMap } from "lodash";

export const state = {
  currentBoardCards: [],
  error: null,
  currentCard: null
};
export const getters = {
  currentBoardCards: state => state.currentBoardCards,
  currentCard: state => state.currentCard,
  currentCardTagsIds: state =>
    state.currentCard && state.currentCard.tags
      ? state.currentCard.tags.map(({ _id }) => _id)
      : []
};

export const actions = {
  getCardById: async ({ commit }, cardId) => {
    try {
      const { data } = await apolloClient.query({
        query: CARD_BY_ID,
        variables: cardId
      });
      commit(types.GET_CURRENT_CARD_SUCCESS, data.cardById);
      return data.cardById;
    } catch (e) {
      console.warn(e);
    }
  },
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
    if (columns && columns.length) {
      state.currentBoardCards = flatMap(columns, col => col.cards);
    }
  },
  [types.RESET_BOARD_CARDS]: state => (state.currentBoardCards = []),
  [types.UPSERT_CARD_SUCCESS]: (state, newCard) => {
    if (!state.currentBoardCards.some(c => c._id === newCard._id)) {
      state.currentBoardCards.push(newCard);
    } else {
      const index = state.currentBoardCards.findIndex(
        c => c._id === newCard._id
      );
      state.currentBoardCards = [
        ...state.currentBoardCards.slice(0, index),
        newCard,
        ...state.currentBoardCards.slice(index + 1)
      ];

      if (state.currentCard._id === newCard._id) {
        state.currentCard = newCard;
      }
    }
  },
  [types.UPSERT_TAG_SUCCESS]: (state, tag) => {
    const tagIndex = state.currentCard.tags.findIndex(t => t._id === tag._id);
    if (tagIndex > -1) {
      state.currentCard = {
        ...state.currentCard,
        tags: [
          ...state.currentCard.tags.slice(0, tagIndex),
          tag,
          ...state.currentCard.tags.slice(tagIndex + 1)
        ]
      };
    }
  },

  [types.GET_CURRENT_CARD_SUCCESS]: (state, card) => (state.currentCard = card),
  [types.ADD_OR_REMOVE_TAG_TO_CARD_SUCCESS]: (state, tags) =>
    (state.currentCard = { ...state.currentCard, tags })
};

export default {
  state,
  getters,
  actions,
  mutations
};
