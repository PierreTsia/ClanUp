import { shallowMount, createLocalVue } from "@vue/test-utils";
import EditCardModal from "@/components/base/EditCardModal";
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
  it("should display the card title ", () => {
    const wrapper = shallowMount(EditCardModal, {
      localVue,
      store,
      propsData: {
        modalProps
      }
    });

    const title = wrapper.find(".cardTitle");
    expect(title.exists()).toBe(true);
    expect(title.text()).toEqual("test");
  });

  it("should display the title of the card column", () => {
    const wrapper = shallowMount(EditCardModal, {
      localVue,
      store,
      propsData: {
        modalProps
      }
    });
    const subtitle = wrapper.find(".columnName");
    expect(subtitle.exists()).toBe(true);
    expect(subtitle.text()).toEqual("From list column-test");
  });

  it("should display a text input if title is clicked", async () => {
    const wrapper = shallowMount(EditCardModal, {
      localVue,
      store,
      propsData: {
        modalProps
      }
    });
    const title = wrapper.find(".cardTitle");
    expect(wrapper.vm.isCardTitleEdited).toEqual(false);

    title.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isCardTitleEdited).toEqual(true);
    const textField = wrapper.find(".textField");
    expect(textField.exists()).toEqual(true);
  });
});
