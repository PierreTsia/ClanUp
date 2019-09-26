import { shallowMount, createLocalVue } from "@vue/test-utils";
import Login from "@/views/Login.vue";
import SliderSelector from "@/components/base/SliderSelector";
import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import jest from "jest-mock";
Vue.use(Vuetify);

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Login.vue", () => {
  it("should render component", () => {
    const wrapper = shallowMount(Login, { localVue, store: getStore() });
    expect(wrapper).toBeDefined();
  });

  it("should display active login component and toggle signup/signin", () => {
    const wrapper = shallowMount(Login, { localVue, store: getStore() });
    const componentRef1 = wrapper.find(".login__card");
    expect(wrapper.vm.$data.activeComponentId).toEqual("signup-form");
    expect(componentRef1.name()).toEqual("SignupForm");
    const selector = wrapper.find(SliderSelector);
    expect(selector.exists()).toBe(true);
    selector.vm.$emit("onItemClick", { id: "signin-form" });
    const componentRef2 = wrapper.find(".login__card");
    expect(wrapper.vm.$data.activeComponentId).toEqual("signin-form");
    expect(componentRef2.name()).toEqual("SigninForm");
  });
});
const mutations = {
  CLEAR_ERRORS: () => jest.fn()
};
const getStore = () =>
  new Vuex.Store({
    state: {},
    actions: {},
    getters: {
      me: () => {},
      authError: () => {}
    },
    mutations
  });
