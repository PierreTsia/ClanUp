import { shallowMount, createLocalVue } from "@vue/test-utils";
import HelloWorld from "@/components/HelloWorld.vue";
import Vue from "vue";
import Vuetify from "vuetify";
Vue.use(Vuetify);
import Vuex from "vuex";

describe("HelloWorld.vue", () => {
  let wrapper;
  let localVue;
  const mock = { username: "mock", email: "email", _id: "mockId" };
  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuetify, Vuex);
    wrapper = shallowMount(HelloWorld, {
      mocks: {
        $store: {
          getters: {
            me: mock
          }
        }
      }
    });
  });
  it("Should render component", () => {
    expect(wrapper).toBeDefined();
  });
  it("should greet logged in user", () => {
    const title = wrapper.find(".heading");
    expect(title.text()).toBe('Welcome back mock')
  });
});
