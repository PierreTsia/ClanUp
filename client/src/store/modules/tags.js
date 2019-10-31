import * as types from "../mutation-types";
import { defaultClient as apolloClient } from "../../main";
import { ADD_TAG_TO_CARD, ALL_TAGS } from "../../../queries";

export const state = {
  allTags: [],
  error: null
};
export const getters = {
  allTags: state => state.allTags
};

export const actions = {
  getAllTags: async ({ commit }) => {
    console.log("salut");
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
      console.log("action", data.addTagToCard);
      commit(types.ADD_TAG_TO_CARD_SUCCESS, data.addTagToCard.tags);
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
