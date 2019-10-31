import * as types from "../mutation-types";
import { defaultClient as apolloClient } from "../../main";
import {
  ADD_TAG_TO_CARD,
  BOARD_TAGS,
  REMOVE_TAG_FROM_CARD
} from "../../../queries";

export const state = {
  allTags: [],
  error: null
};
export const getters = {
  allTags: state => state.allTags
};

export const actions = {
  getBoardTags: async ({ commit }, payload) => {
    console.log("salut", payload);
    try {
      const { data } = await apolloClient.query({
        query: BOARD_TAGS,
        variables: payload
      });
      commit(types.FETCH_TAGS_SUCCESS, data.boardTags);
    } catch (e) {
      console.warn(e);
    }
  },
  addTagToCard: async ({ commit }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: ADD_TAG_TO_CARD,
        variables: payload
      });
      commit(types.ADD_OR_REMOVE_TAG_TO_CARD_SUCCESS, data.addTagToCard.tags);
    } catch (e) {
      console.warn(e);
    }
  },

  removeTagFromCard: async ({ commit }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: REMOVE_TAG_FROM_CARD,
        variables: payload
      });
      commit(
        types.ADD_OR_REMOVE_TAG_TO_CARD_SUCCESS,
        data.removeTagFromCard.tags
      );
    } catch (e) {
      console.warn(e);
    }
  }
};

export const mutations = {
  [types.FETCH_TAGS_SUCCESS]: (state, tags) => (state.allTags = tags)
};

export default {
  state,
  getters,
  actions,
  mutations
};
