import * as types from "../mutation-types";
import { defaultClient as apolloClient } from "../../main";
import { GET_CURRENT_USER } from "../../../queries";

export const state = {
  currentUser: null,
  error: null
};
const getters = {
  isAuth: state => !!state.currentUser,
  authError: state => state.error,
  me: state => state.currentUser
};
export const actions = {
  getCurrentUser: async ({ commit }) => {
    try {
      const { data } = await apolloClient.query({ query: GET_CURRENT_USER });
      commit(types.SET_CURRENT_USER, data.getCurrentUser);
    } catch (e) {
      console.warn(e);
    }
  }
};
export const mutations = {
  [types.SET_AUTH_ERROR]: (state, error) => (state.error = error),
  [types.SET_CURRENT_USER]: (state, user) => (state.currentUser = user)
};
export default {
  state,
  getters,
  actions,
  mutations
};
