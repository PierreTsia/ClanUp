import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import vuetify from "./plugins/vuetify";
import ApolloClient from "apollo-boost";
import VueApollo from "vue-apollo";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import * as types from "./store/mutation-types";

Vue.use(VueApollo);

const API_URI =
  process.env.NODE_ENV === "production"
    ? "https://clanup.herokuapp.com"
    : "http://localhost:4000";

export const defaultClient = new ApolloClient({
  uri: `${API_URI}/graphql`,
  fetchOptions: {
    credentials: "include"
  },
  request: operation => {
    // auth headers
    if (!localStorage.token) {
      localStorage.setItem("token", "");
    }
    operation.setContext({
      headers: {
        authorization: localStorage.getItem("token")
      }
    });
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log("[NETWORK ERROR]", networkError);
    }
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.dir(err);
        if (err.name === "AuthenticationError") {
          console.warn(err);
          store.commit(types.SET_AUTH_ERROR, err);
          store.dispatch("logout");
        }
      }
    }
  }
});
const apolloProvider = new VueApollo({ defaultClient });
Vue.config.productionTip = false;

new Vue({
  apolloProvider,
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
