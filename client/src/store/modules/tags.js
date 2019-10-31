import * as types from "../mutation-types";
import { defaultClient as apolloClient } from "../../main";
import {
  ADD_TAG_TO_CARD,
  ALL_TAGS,
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
  getAllTags: async ({ commit }) => {
    try {
      const { data } = await apolloClient.query({
        query: ALL_TAGS
      });
      commit(types.FETCH_TAGS_SUCCESS, data.allTags);
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
