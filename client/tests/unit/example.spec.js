import { shallowMount, createLocalVue } from "@vue/test-utils";
import HelloWorld from "@/components/HelloWorld.vue";
import Vue from "vue";
import Vuetify from "vuetify";
Vue.use(Vuetify);

describe("HelloWorld.vue", () => {
  let localVue;
  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuetify);
  });
  it("Should render component", () => {
    const wrapper = shallowMount(HelloWorld);
    expect(wrapper).toBeDefined();
  });
});
