import { mount, shallowMount } from "@vue/test-utils";
import Login from "@/views/Login.vue";
import Vue from "vue";
import Vuetify from "vuetify";
Vue.use(Vuetify);

describe("Login.vue", () => {
  it("should render component", () => {
    const wrapper = shallowMount(Login);
    expect(wrapper).toBeDefined();
  });

  it("should have an active component id set to sign up", () => {
    const wrapper = shallowMount(Login);
    expect(wrapper.vm.$data.activeComponentId).toEqual("signup-form");

    console.log(wrapper.vm.$data.activeComponentId);
    /*const textFields = wrapper.findAll(".v-text-field");
    expect(textFields.length).toEqual(6);
    expect(textFields.at(0).props().label).toBe("E-mail");
    expect(textFields.at(1).props().label).toBe("Password");*/
  });
});
