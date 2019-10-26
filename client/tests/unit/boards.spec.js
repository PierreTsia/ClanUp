import Boards from "@/components/boards/Boards.vue";
import Board from "@/components/boards/Board.vue";

import Vue from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
Vue.use(Vuetify);
//import jest from "jest-mock";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import jest from "jest-mock";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);

const router = new VueRouter();
describe("Boards.vue", () => {
  let wrapper;
  beforeEach(() => {
    jest.spyOn(actions, "openModal");
    wrapper = shallowMount(Boards, {
      propsData: {
        boards
      },
      localVue,
      router,
      store: getStore()
    });
  });

  it("should render the component", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should render a board component for each board", () => {
    const boards = wrapper.findAll(Board);
    expect(boards.length).toBe(2);
  });

  it("should open a create new board modal if create new board is clicked", () => {
    wrapper.vm.handleCreateNewBoardClick();
    expect(actions.openModal).toHaveBeenCalledWith(
      expect.any(Object),
      {
        name: "create-board-modal",
        props: expect.any(Object)
      },
      undefined
    );
  });

  it("should redirect to /board with boardId as param if a board is clicked", () => {
    jest.spyOn(wrapper.vm, "handleBoardClick");
    jest.spyOn(router, "push");
    const boardsCmp = wrapper.findAll(Board);
    [...Array(boardsCmp.length).keys()].forEach(index => {
      boardsCmp.at(index).trigger("click");
      expect(router.push).toHaveBeenCalledWith(`/board/${boards[index]._id}`);
    });
  });

  it("should open a confirm delete popin if delete icon is clicked", () => {
    jest.spyOn(wrapper.vm, "handleDeleteClick");
    wrapper.find(Board).vm.$emit("onDeleteClick", boards[0]);
    expect(actions.openModal).toHaveBeenCalledWith(
      expect.any(Object),
      {
        name: "confirm-modal",
        props: expect.any(Object)
      },
      undefined
    );
  });
});

const boards = [
  {
    _id: "5d89e1bbf16a960017110939",
    boardname: "My awesome project",
    coverImg: null,
    color: "#B37B2C",
    createdDate:
      "Tue Sep 24 2019 11:28:27 GMT+0200 (Central European Summer Time)",
    __typename: "Board"
  },
  {
    _id: "5d89ca63d165e600177dcbf4",
    boardname: "My awesome project",
    coverImg: "https://i.ibb.co/ZVsfdHr/bg-rand4.jpg",
    color: "#001A29",
    createdDate:
      "Tue Sep 24 2019 09:48:51 GMT+0200 (Central European Summer Time)",
    __typename: "Board"
  }
];
const actions = {
  openModal: () => jest.fn(),
  closeModal: () => jest.fn()
};

const getStore = () =>
  new Vuex.Store({
    state: {},
    actions,
    getters: {
      me: () => {}
    }
  });
