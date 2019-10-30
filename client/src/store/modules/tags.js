import * as types from "../mutation-types";
import { defaultClient as apolloClient } from "../../main";
import { ALL_TAGS } from "../../../queries";

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
