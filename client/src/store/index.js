import Vue from "vue";
import Vuex from "vuex";

import app from "./modules/app";
import auth from "./modules/auth";
import boards from "./modules/boards";
import columns from "./modules/columns";
import cards from "./modules/cards";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app,
    auth,
    boards,
    columns,
    cards
  }
});
