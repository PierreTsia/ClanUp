import BoardView from "@/views/BoardView.vue";
import currentBoardMock from "./mocks/currentBoardMock";

import Vue from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
Vue.use(Vuetify);
import { shallowMount, createLocalVue } from "@vue/test-utils";
import jest from "jest-mock";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);

const router = new VueRouter();
describe("Boards.vue", () => {
  let wrapper;

  const BtnStub = {
    template: "<div />"
  };

  const TextFieldStub = {
    template: "<input />"
  };

  beforeEach(() => {
    /*  jest.spyOn(actions, "openModal");*/
    wrapper = shallowMount(BoardView, {
      /*propsData: {
        boards
      },*/
      localVue,
      stubs: {
        VBtn: BtnStub,
        VTextField: TextFieldStub
      },
      router,
      store: getStore()
    });
  });

  it("should render the component", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should have a boardview div with background color set by currentBoard property", () => {
    const boardview = wrapper.find(".boardView");
    expect(boardview.exists()).toBe(true);
    expect(boardview.attributes().style).toBe(
      "background-color: rgb(0, 26, 41);"
    );
  });

  it("should have a top section", () => {
    const topSection = wrapper.find(".boardView__top");
    expect(topSection.exists()).toBe(true);
    const btn = wrapper.find(".boardView__top__edit");
    expect(btn.exists()).toBe(true);
  });

  it("should have a btn to toggle edit mode", () => {
    expect(wrapper.vm.isBoardNameEdited).toBe(false);
    wrapper.find(BtnStub).vm.$emit("click");
    expect(wrapper.vm.isBoardNameEdited).toBe(true);
  });

  it("should display a text field if in edit mode", async () => {
    jest.spyOn(actions, "updateBoard");
    const textField = wrapper.find(TextFieldStub);
    expect(textField.exists()).toBe(true);
  });
});

const actions = {
  openModal: () => jest.fn(),
  closeModal: () => jest.fn(),
  getBoardById: () => jest.fn(),
  updateBoard: () => jest.fn()
};

const getStore = () =>
  new Vuex.Store({
    state: {},
    actions,
    getters: {
      me: () => {},
      currentBoard: () => currentBoardMock,
      boardColumns: () => []
    }
  });
