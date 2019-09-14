import { mount, createLocalVue } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vue from "vue";
Vue.use(Vuetify);

import Home from "@/views/Home.vue";
const localVue = createLocalVue();
localVue.use(Vuetify);

describe("Home.vue", () => {
  beforeEach(() => {});

  it("renders component", () => {
    const wrapper = mount(Home);

    expect(wrapper).toBeDefined();
  });
});
