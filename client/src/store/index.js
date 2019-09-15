import Vue from "vue";
import Vuex from "vuex";
//import router from "../router";
import { defaultClient as apolloClient } from "../main";
//import { GET_POSTS, SIGNIN_USER, GET_CURRENT_USER } from "../../queries";

import app from "./modules/app";
//import posts from "./modules/posts";
import auth from "./modules/auth";
//import tags from "./modules/tags";
//import profile from "./modules/profile";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app,
    auth
  }
});
