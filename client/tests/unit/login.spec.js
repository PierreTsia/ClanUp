import { shallowMount } from "@vue/test-utils";
import Login from "@/views/Login.vue";
import Vue from "vue";
import Vuetify from "vuetify";
Vue.use(Vuetify);

describe("Login.vue", () => {
  it("should render component", () => {
    const wrapper = shallowMount(Login);
    expect(wrapper).toBeDefined();
  });

  it("should display active login component and toggle signup/signin", () => {
    const wrapper = shallowMount(Login);
    const componentRef1 = wrapper.find(".login__card");
    expect(wrapper.vm.$data.activeComponentId).toEqual("signup-form");
    expect(componentRef1.name()).toEqual("SignupForm");
    wrapper.vm.handleFormChange({ id: "signin-form" });
    const componentRef2 = wrapper.find(".login__card");
    expect(wrapper.vm.$data.activeComponentId).toEqual("signin-form");
    expect(componentRef2.name()).toEqual("SigninForm");
  });


});
