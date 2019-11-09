import { shallowMount, createLocalVue } from "@vue/test-utils";
import EditCardModal from "@/components/base/EditCardModal";
import EditCardModalHeader from "@/components/base/editCardModal/EditCardModalHeader";
import createStub from "./support/createStubWithProps";
import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
Vue.use(Vuetify);

const localVue = createLocalVue();
localVue.use(Vuex);

describe("EditCardModal.vue", () => {
  const modalProps = {
    card: { _id: "1", title: "test", columnId: { title: "column-test" } }
  };
  const store = {
    getters: {
      currentBoard: () => {},
      me: () => {},
      allTags: () => [],
      currentCard: () => ({
        _id: "1",
        title: "test",
        columnId: { title: "column-test" }
      })
    }
  };

  it("should render component", () => {
    const wrapper = shallowMount(EditCardModal, {
      localVue,
      store,

      propsData: {
        modalProps
      }
    });
    expect(wrapper).toBeDefined();
  });
  it("should display the card title ", async () => {
    const wrapper = shallowMount(EditCardModal, {
      localVue,
      store,
      stubs: { EditCardModalHader: createStub(EditCardModalHeader) },
      propsData: {
        modalProps
      }
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.find(EditCardModalHeader).props("cardTitle")).toEqual(
      modalProps.card.title
    );
  });

  it("should display the title of the card column", async () => {
    const wrapper = shallowMount(EditCardModal, {
      localVue,
      store,
      stubs: { EditCardModalHader: createStub(EditCardModalHeader) },

      propsData: {
        modalProps
      }
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.find(EditCardModalHeader).props("columnTitle")).toEqual(
      modalProps.card.columnId.title
    );
  });

  it("should toggle titleIsEdited and pass it as a prop to header sub component", async () => {
    const wrapper = shallowMount(EditCardModal, {
      localVue,
      store,
      stubs: { EditCardModalHader: createStub(EditCardModalHeader) },

      propsData: {
        modalProps
      }
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isCardTitleEdited).toEqual(false);
    expect(
      wrapper.find(EditCardModalHeader).props("isCardTitleEdited")
    ).toEqual(false);

    const header = wrapper.find(EditCardModalHeader);
    header.vm.$emit("onEditTitleClick");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isCardTitleEdited).toEqual(true);
    expect(
      wrapper.find(EditCardModalHeader).props("isCardTitleEdited")
    ).toEqual(true);
  });
});
