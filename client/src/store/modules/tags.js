import * as types from "../mutation-types";
import { defaultClient as apolloClient } from "../../main";
import {
  ADD_TAG_TO_CARD,
  BOARD_TAGS,
  REMOVE_TAG_FROM_CARD,
  UPSERT_TAG
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
  },

  upsertTag: async ({ commit }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: UPSERT_TAG,
        variables: payload
      });
      commit(types.UPSERT_TAG_SUCCESS, data.upsertTag);
    } catch (e) {
      console.warn(e);
    }
  }
};

export const mutations = {
  [types.FETCH_TAGS_SUCCESS]: (state, tags) => (state.allTags = tags),
  [types.UPSERT_TAG_SUCCESS]: (state, tag) => {
    const tagIndex = state.allTags.findIndex(t => t._id === tag._id);
    if (tagIndex > -1) {
      state.allTags = [
        ...state.allTags.slice(0, tagIndex),
        tag,
        ...state.allTags.slice(tagIndex + 1)
      ];
    } else {
      state.allTags.unshift(tag);
    }
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
