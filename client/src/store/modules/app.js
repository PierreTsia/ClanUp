import * as types from "../mutation-types";

export const state = {
  isLoading: false,
  isSnackShown: false,
  snackProps: {},
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
  isDark: state => state.darkmode,
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
  }
};
export const mutations = {
  [types.APP_DARK_MODE]: state => (state.darkmode = !state.darkmode),
  [types.APP_OPEN_MODAL]: (state, modal) => (state.modal = modal),
  [types.APP_CLOSE_MODAL]: state => (state.modal = { name: null, props: {} })
};
export default {
  state,
  getters,
  actions,
  mutations
};
