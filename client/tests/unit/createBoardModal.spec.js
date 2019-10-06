import { shallowMount, createLocalVue } from "@vue/test-utils";
import CreateBoardModal from "@/components/base/CreateBoardModal";
import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
Vue.use(Vuetify);

const localVue = createLocalVue();
localVue.use(Vuex);

describe("CreateBoardModal.vue", () => {
  it("should render component", () => {
    const wrapper = shallowMount(CreateBoardModal, { localVue });
    expect(wrapper).toBeDefined();
  });

  it("should  send properly formatted boardInput on confirm click", () => {
    const modalProps = { onConfirmClick: () => jest.fn() };
    jest.spyOn(modalProps, "onConfirmClick");
    const wrapper = shallowMount(CreateBoardModal, {
      localVue,
      store: getStore(),
      propsData: { modalProps }
    });

    wrapper.setData({
      boardname: "valid",
      description: "valid",
      activeBackground: { coverImg: null, color: "#B37B2C" }
    });

    wrapper.vm.handleConfirmClick();

    expect(modalProps.onConfirmClick).toHaveBeenCalled();
  });

  it("should not send badly formatted boardInput on confirm click", () => {
    const modalProps = { onConfirmClick: () => jest.fn() };
    jest.spyOn(modalProps, "onConfirmClick");
    const wrapper = shallowMount(CreateBoardModal, {
      localVue,
      store: getStore(),
      propsData: { modalProps }
    });

    wrapper.setData({
      boardname: "",
      description: "",
      activeBackground: { coverImg: null, color: "#B37B2C" }
    });

    wrapper.vm.handleConfirmClick();

    expect(modalProps.onConfirmClick).not.toHaveBeenCalled();
  });
});

const getStore = () =>
  new Vuex.Store({
    state: {},
    actions: {},
    getters: {
      me: () => {
        return {
          _id: "5d8622c8368bc87dd6a44b8c",
          username: "pierre_Tsia",
          avatar:
            "https://gravatar.com/avatar/98f0de97c688d90aacbea76a272215be?d=identicon"
        };
      }
    }
  });
