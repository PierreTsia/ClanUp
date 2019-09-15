export const state = {
  isLoading: false,
  isSnackShown: false,
  snackProps: {}
};
const getters = {
  isAppLoading: state => state.isLoading,
  isSnackShown: state => state.isSnackShown,
  snackProps: state => state.snackProps
};
export const actions = {};
export const mutations = {};
export default {
  state,
  getters,
  actions,
  mutations
};
