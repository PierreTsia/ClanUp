import { mount, createLocalVue } from "@vue/test-utils";
import App from "@/App.vue";
import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
Vue.use(Vuetify);

const localVue = createLocalVue();
localVue.use(Vuex);

describe("App.vue", () => {
  let wrapper;
  let vuetify;
  let getters;
  let store;
  beforeEach(() => {
    vuetify = new Vuetify();
    getters = {
      me: () => ({ username: "Jm Mock", email: "test@test.com" }),
      activeModalName: () => "test",
      modalProps: () => {},
      isDark: () => true
    };

    store = new Vuex.Store({
      getters
    });
    wrapper = mount(App, { store, localVue, vuetify, stubs: ["router-view"] });
  });

  it("should render the App view", () => {
    expect(wrapper).toBeDefined();
  });
});
