import { mount, createLocalVue } from "@vue/test-utils";
import SigninForm from "@/components/login/SigninForm.vue";
import Vue from "vue";
import Vuetify from "vuetify";
Vue.use(Vuetify);

const localVue = createLocalVue();

describe("SigninForm.vue", () => {
  let wrapper;
  let vuetify;
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(SigninForm, { localVue, vuetify });
  });
  it("should render the component", () => {
    expect(wrapper).toBeDefined();
  });

  ["email", "password", "emailRules", "passwordRules", "valid"].forEach(
    expectedData => {
      it(`Should have ${expectedData} as component data`, () => {
        expect(wrapper.vm.$data[expectedData]).toBeDefined();
      });
    }
  );

  it("should enforce email rules", () => {
    const { emailRules } = wrapper.vm.$data;

    //unformatted
    wrapper.setData({ email: "aaa" });
    let [hasValue, hasEmailFormat] = emailRules.map(rule =>
      rule(wrapper.vm.$data.email)
    );

    expect(hasValue).toEqual(true);
    expect(hasEmailFormat).not.toEqual(true);

    //no value
    wrapper.setData({ email: "" });
    [hasValue, hasEmailFormat] = emailRules.map(rule =>
      rule(wrapper.vm.$data.email)
    );
    expect(hasValue).not.toEqual(true);
    expect(hasEmailFormat).not.toEqual(true);

    //correct value
    wrapper.setData({ email: "test@test.fr" });
    [hasValue, hasEmailFormat] = emailRules.map(rule =>
      rule(wrapper.vm.$data.email)
    );

    expect(hasValue).toEqual(true);
    expect(hasEmailFormat).toEqual(true);
  });

  it("should enforce password rules", () => {
    const { passwordRules } = wrapper.vm.$data;

    //no value
    wrapper.setData({ password: "" });
    let [hasValue, isCorrectLength] = passwordRules.map(rule =>
      rule(wrapper.vm.$data.password)
    );
    expect(hasValue).not.toEqual(true);
    expect(isCorrectLength).not.toEqual(true);

    //too long string
    wrapper.setData({ password: "aaaaaaaaaaaaaaaaaa" });
    [hasValue, isCorrectLength] = passwordRules.map(rule =>
      rule(wrapper.vm.$data.password)
    );
    expect(hasValue).toEqual(true);
    expect(isCorrectLength).not.toEqual(true);

    //correct value
    wrapper.setData({ password: "123456" });
    [hasValue, isCorrectLength] = passwordRules.map(rule =>
      rule(wrapper.vm.$data.password)
    );
    expect(hasValue).toEqual(true);
    expect(isCorrectLength).toEqual(true);
  });

  it("should only emit email and password given valid params ", () => {
    wrapper.setData({ password: "0", email: ".fr" });
    wrapper.vm.validate();

    expect(wrapper.emitted("onValidateSigninClick")).not.toBeTruthy();

    wrapper.setData({ password: "123456", email: "test@test.fr" });
    wrapper.vm.validate();

    expect(wrapper.emitted("onValidateSigninClick")).toBeTruthy();
  });
});
