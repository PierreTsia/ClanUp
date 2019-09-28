import * as types from "../mutation-types";

export const state = {
  isLoading: false,
  isSnackShown: false,
  snackProps: {},
  theme: null,
  darkmode: false,
  modal: {
    name: null,
    props: {}
  }
};
const getters = {
  isAppLoading: state => state.isLoading,
  isSnackShown: state => state.isSnackShown,
  snackProps: state => state.snackProps,
  isDark: state => state.theme === "dark",
  isModalShown: state => !!(state.modal && state.modal.name),
  activeModalName: state => state.modal.name,
  modalProps: state => state.modal.props
};
export const actions = {
  openModal({ commit }, modal) {
    commit(types.APP_OPEN_MODAL, modal);
  },
  closeModal({ commit }) {
    commit(types.APP_CLOSE_MODAL);
  },
  setAppTheme({ commit }, theme) {
    localStorage.setItem("theme", theme);
    commit(types.APP_THEME_SWITCH, theme);
  },

  getAppTheme({ commit }) {
    const theme = localStorage.getItem("theme");
    if (theme) {
      commit(types.APP_THEME_SWITCH, theme);
      return theme;
    }
  }
};
export const mutations = {
  [types.APP_DARK_MODE]: state => (state.darkmode = !state.darkmode),
  [types.APP_OPEN_MODAL]: (state, modal) => (state.modal = modal),
  [types.APP_CLOSE_MODAL]: state => (state.modal = { name: null, props: {} }),
  [types.APP_THEME_SWITCH]: (state, theme) => (state.theme = theme)
};
export default {
  state,
  getters,
  actions,
  mutations
};
