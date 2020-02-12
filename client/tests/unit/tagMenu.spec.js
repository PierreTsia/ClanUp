import { shallowMount, createLocalVue } from "@vue/test-utils";
import { mockTags } from "./mocks/mockTags";
import TagMenu from "@/components/base/menus/TagMenu";
import ExistingTag from "@/components/base/menus/ExistingTag";
import EditedTag from "@/components/base/menus/EditedTag";

import createStub from "./support/createStubWithProps";
import Vuex from "vuex";
import Vuetify from "vuetify";
import Vue from "vue";
const localVue = createLocalVue();
Vue.use(Vuetify);
localVue.use(Vuex);

describe("TagMenu.vue", () => {
  it("should render the component", () => {
    const wrapper = shallowMount(TagMenu, { localVue, store: getStore() });
    expect(wrapper.exists()).toBe(true);
  });
  it("should display by default the 6 first tags and searched tag if a query is set", () => {
    const wrapper = shallowMount(TagMenu, {
      localVue,
      store: getStore(),
      stubs: {
        ExistingTagStub: createStub(ExistingTag)
      }
    });
    expect(wrapper.vm.displayTags.length).toEqual(6);
    const tagsWrappers = wrapper.findAll(ExistingTag);
    expect(tagsWrappers.length).toEqual(6);
    wrapper.setData({ searchQuery: "pouet" });
    expect(wrapper.vm.displayTags.length).toEqual(1);
    const searchedTagsWrappers = wrapper.findAll(ExistingTag);
    expect(searchedTagsWrappers.length).toEqual(1);
  });

  it("should emit @onTagEdited with appropriate payload when ExistingTag emits @onEdit", () => {
    const wrapper = shallowMount(TagMenu, {
      localVue,
      store: getStore(),
      stubs: {
        ExistingTagStub: createStub(ExistingTag)
      }
    });
    const tagsWrappers = wrapper.findAll(ExistingTag);
    tagsWrappers.at(2).vm.$emit("onEdit", mockTags[2]);
    expect(wrapper.emitted("onTagEdited")).toBeTruthy();
    expect(wrapper.emitted().onTagEdited[0]).toEqual([mockTags[2]]);
  });

  it("should emit @onTagSelect with appropriate payload when ExistingTag emits @onSelect", () => {
    const wrapper = shallowMount(TagMenu, {
      localVue,
      store: getStore(),
      stubs: {
        ExistingTagStub: createStub(ExistingTag)
      }
    });
    const tagsWrappers = wrapper.findAll(ExistingTag);
    tagsWrappers.at(2).vm.$emit("onSelect", mockTags[2]);
    expect(wrapper.emitted("onTagSelect")).toBeTruthy();
    expect(wrapper.emitted().onTagSelect[0]).toEqual([mockTags[2]]);
  });

  it("should emit @onTagEdited with appropriate payload when create new btn is click", () => {
    const wrapper = shallowMount(TagMenu, {
      localVue,
      store: getStore(),
      stubs: {
        ExistingTagStub: createStub(ExistingTag)
      }
    });
    wrapper.setData({ searchQuery: "pouet" });
    const btn = wrapper.find(".tagMenu__actions > .tag");
    expect(btn.exists()).toBe(true);
    btn.trigger("click");
    expect(wrapper.emitted("onTagEdited")).toBeTruthy();
    const expectedTag = {
      _id: null,
      board: "test",
      color: "#1483BB",
      label: "pouet"
    };
    expect(wrapper.emitted().onTagEdited[0]).toEqual([expectedTag]);
  });
  it("should display EditedTag component and pass it a tag props if it's edited", () => {
    const wrapper = shallowMount(TagMenu, {
      localVue,
      store: getStore(),
      stubs: {
        ExistingTagStub: createStub(ExistingTag),
        EditedTagStub: createStub(EditedTag)
      },
      propsData: {
        editedTag: mockTags[0]
      }
    });

    const existingTags = wrapper.findAll(ExistingTag);
    expect(existingTags.length).toEqual(0);

    const editedTag = wrapper.find(EditedTag);
    expect(editedTag.exists()).toBe(true);
    expect(editedTag.props().tag).toEqual(mockTags[0]);
  });
});

const getStore = () =>
  new Vuex.Store({
    state: {},
    actions: {},
    getters: {
      allTags: () => mockTags,
      currentCardTagsIds: () => [],
      currentBoard: () => ({
        _id: "test"
      })
    }
  });
