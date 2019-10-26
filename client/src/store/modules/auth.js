import * as types from "../mutation-types";
import { defaultClient as apolloClient } from "../../main";
import {
  GET_CURRENT_USER,
  SIGNIN_USER,
  SIGNUP_USER,
  VERIFY_USER_NAME
} from "../../../queries";
import router from "../../router";

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
      //eslint-disable-next-line
      console.warn(e);
      const { message, name } = e;
      commit(types.SET_AUTH_ERROR, { message, name });
    }
  },
  signup: async ({ commit }, { userInput }) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: SIGNUP_USER,
        variables: { userInput }
      });
      const { token } = data.signupUser;
      localStorage.setItem("token", token);
      commit(types.SET_LOGIN_SUCCESS);
      await router.go("/");
    } catch (e) {
      //eslint-disable-next-line
      console.warn(e);
      const { message, name } = e;
      commit(types.SET_AUTH_ERROR, { message, name });
    }
  },
  login: async ({ commit }, payload) => {
    localStorage.setItem("token", "");
    try {
      const { data } = await apolloClient.mutate({
        mutation: SIGNIN_USER,
        variables: payload
      });
      const { token, user } = data.signinUser;
      localStorage.setItem("token", token);
      commit(types.SET_LOGIN_SUCCESS, user);
      await router.push("/");
    } catch (e) {
      //eslint-disable-next-line
      console.warn(e);
      const { message, name } = e;
      commit(types.SET_AUTH_ERROR, { message, name });
    }
  },
  logout: async ({ commit }) => {
    localStorage.setItem("token", "");
    commit(types.SET_CURRENT_USER, null);
    await apolloClient.resetStore();
    commit(types.SET_LOG_OUT_SUCCESS);
    router.go("/login");
  },
  verifyUsername: async (_, username) => {
    try {
      const { data } = await apolloClient.query({
        query: VERIFY_USER_NAME,
        variables: { username }
      });
      return data.isUsernameAvalaible;
    } catch (e) {
      //eslint-disable-next-line
      console.warn(e);
    }
  }
};
export const mutations = {
  [types.SET_AUTH_ERROR]: (state, error) => (state.error = error),
  [types.SET_CURRENT_USER]: (state, user) => (state.currentUser = user),
  [types.SET_LOG_OUT_SUCCESS]: state => (state.currentUser = null),
  [types.SET_LOGIN_SUCCESS]: (state, user) => (state.currentUser = user),
  [types.SET_AUTH_ERROR]: (state, error) => (state.error = error),
  [types.CLEAR_ERRORS]: state => (state.error = null)
};
export default {
  state,
  getters,
  actions,
  mutations
};
