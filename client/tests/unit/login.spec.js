import { mount } from "@vue/test-utils";
import Login from "@/views/Login.vue";
import Vue from "vue";
import Vuetify from "vuetify";
Vue.use(Vuetify);

describe("Login.vue", () => {
  it("should render component", () => {
    const wrapper = mount(Login);
    expect(wrapper).toBeDefined();
  });

  it("should have inputs for email and password", () => {
    const wrapper = mount(Login);
    const textFields = wrapper.findAll(".v-text-field");
    expect(textFields.length).toEqual(6);
    expect(textFields.at(0).props().label).toBe("E-mail");
    expect(textFields.at(1).props().label).toBe("Password");
  });
});
