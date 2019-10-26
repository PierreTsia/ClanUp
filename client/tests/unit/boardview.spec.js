import BoardView from "@/views/BoardView.vue";
import currentBoardMock from "./mocks/currentBoardMock";

import Vue from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import ListHeader from "@/components/board/ListHeader";

Vue.use(Vuetify);
import { shallowMount, createLocalVue } from "@vue/test-utils";
import jest from "jest-mock";

import createStub from "./support/createStubWithProps";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);

const router = new VueRouter();
describe("BoardView.vue", () => {
  let wrapper;

  const BtnStub = {
    template: "<div />"
  };

  const TextFieldStub = {
    template: "<input />"
  };

  beforeEach(() => {
    jest.spyOn(actions, "openModal");
    wrapper = shallowMount(BoardView, {
      /*propsData: {
        boards
      },*/
      localVue,
      stubs: {
        VBtn: BtnStub,
        VTextField: TextFieldStub,
        ListHeader: createStub(ListHeader)
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
    const textField = wrapper.find(TextFieldStub);
    expect(textField.exists()).toBe(true);
  });

  it("should allow user to create a new column", async () => {
    jest.spyOn(actions, "upsertColumn");
    wrapper.setData({ newColumnTitle: "test-1" });
    wrapper.vm.handleCreateColumn();
    await wrapper.vm.$nextTick();
    expect(actions.upsertColumn).toHaveBeenCalledWith(
      expect.any(Object),
      {
        columnInput
      },
      undefined
    );
  });
  it("shoud instantiate a Listheader component per column and pass title as prop", async () => {
    const headers = wrapper.findAll(ListHeader);
    expect(headers.length).toBe(wrapper.vm.columns.length);
    const expectedTitles = wrapper.vm.columns.map(({ title }) => title);
    [...Array(headers.length).keys()].forEach(index => {
      expect(expectedTitles.includes(headers.at(index).props().title)).toBe(
        true
      );
    });
  });

  it("should set a ListHeader to edit mode if edit click is emitted", async () => {
    const headers = wrapper.findAll(ListHeader);
    headers.at(1).vm.$emit("onSelectClick", "edit");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.editedTitleColumnId).toBe(mockColumns[3]._id);
    [...Array(headers.length).keys()].forEach(index => {
      if (index === 1) {
        expect(headers.at(index).props().isTitleEdited).toBe(true);
      } else {
        expect(headers.at(index).props().isTitleEdited).toBe(false);
      }
    });
  });
});

const actions = {
  openModal: jest.fn(),
  closeModal: jest.fn(),
  getBoardById: jest.fn(),
  updateBoard: jest.fn(),
  upsertColumn: jest.fn(),
  updateColumnTitle: jest.fn()
};

const getStore = () =>
  new Vuex.Store({
    state: {},
    actions,
    getters: {
      me: () => {},
      currentBoard: () => currentBoardMock,
      boardColumns: () => mockColumns,
      currentBoardCards: () => []
    }
  });

const mockColumns = [
  {
    _id: "5d99cfe36841127b471c4c62",
    title: "todo",
    position: 3000000,
    __typename: "Column"
  },
  {
    _id: "5d99cfe76841127b471c4c63",
    title: "doing",
    position: 0,
    __typename: "Column"
  },
  {
    _id: "5d99cff06841127b471c4c64",
    title: "to review",
    position: 2000000,
    __typename: "Column"
  },
  {
    _id: "5d99cff46841127b471c4c65",
    title: "done",
    position: 1000000,
    __typename: "Column"
  },
  {
    _id: "5d99f583a3daf911711fed51",
    title: "merged",
    position: 4000000,
    __typename: "Column"
  }
];

const columnInput = {
  boardId: "5d99cfdb6841127b471c4c61",
  createdDate: expect.any(Date),
  position: 5000000,
  title: "test-1"
};
