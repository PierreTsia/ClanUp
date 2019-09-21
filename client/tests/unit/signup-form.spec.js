import { mount, createLocalVue } from "@vue/test-utils";
import SignupForm from "@/components/login/SignupForm.vue";
import Vue from "vue";
import Vuetify from "vuetify";
Vue.use(Vuetify);

const localVue = createLocalVue();
describe("SignupForm.vue", () => {
  let wrapper;
  let vuetify;
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(SignupForm, { localVue, vuetify });
  });

  it("should have 4 inputs form username email and password(2)", () => {
    expect(wrapper).toBeDefined();
    const inputs = wrapper.findAll(".v-text-field");
    expect(inputs.length).toEqual(4);
    ["User Name", "E-mail", "Password", "Confirm password"].forEach(
      (label, index) => {
        expect(inputs.at(index).text()).toEqual(label);
      }
    );
  });

  it("should enforce username rules", () => {
    const { usernameRules } = wrapper.vm.$data;
    expect(usernameRules).toBeDefined();

    let hasValue, hasNoSpaces, hasCorrectLength;
    //empty
    wrapper.setData({ username: "" });
    [hasValue, hasNoSpaces, hasCorrectLength] = usernameRules.map(rule =>
      rule(wrapper.vm.$data.username)
    );
    expect(hasValue).not.toBe(true);
    expect(hasNoSpaces).toBe(true);
    expect(hasCorrectLength).not.toBe(true);

    //too short
    wrapper.setData({ username: "aa" });
    [hasValue, hasNoSpaces, hasCorrectLength] = usernameRules.map(rule =>
      rule(wrapper.vm.$data.username)
    );
    expect(hasValue).toBe(true);
    expect(hasNoSpaces).toBe(true);
    expect(hasCorrectLength).not.toBe(true);

    //too long
    wrapper.setData({
      username: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    });
    [hasValue, hasNoSpaces, hasCorrectLength] = usernameRules.map(rule =>
      rule(wrapper.vm.$data.username)
    );
    expect(hasValue).toBe(true);
    expect(hasNoSpaces).toBe(true);
    expect(hasCorrectLength).not.toBe(true);

    //has spaces
    wrapper.setData({
      username: "  aa aaa"
    });
    [hasValue, hasNoSpaces, hasCorrectLength] = usernameRules.map(rule =>
      rule(wrapper.vm.$data.username)
    );
    expect(hasValue).toBe(true);
    expect(hasNoSpaces).not.toBe(true);
    expect(hasCorrectLength).toBe(true);

    //correct value
    wrapper.setData({
      username: "validusername"
    });
    [hasValue, hasNoSpaces, hasCorrectLength] = usernameRules.map(rule =>
      rule(wrapper.vm.$data.username)
    );
    expect(hasValue).toBe(true);
    expect(hasNoSpaces).toBe(true);
    expect(hasCorrectLength).toBe(true);
  });
});
