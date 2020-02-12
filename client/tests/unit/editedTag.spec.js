import { shallowMount, createLocalVue } from "@vue/test-utils";
import EditedTag from "@/components/base/menus/EditedTag";
import TagChip from "@/components/base/menus/TagChip";
import createStub from "./support/createStubWithProps";
import { mockTags } from "./mocks/mockTags";

import Vuetify from "vuetify";
import Vue from "vue";
const localVue = createLocalVue();
Vue.use(Vuetify);

describe("EditedTag.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(EditedTag, {
      localVue,
      stubs: {
        TagChipStub: createStub(TagChip)
      },
      propsData: {
        tag: mockTags[0]
      }
    });
  });
  it("should render the component", () => {
    expect(wrapper.exists()).toBe(true);
  });
  it("should have a TagChip component for each color in state", () => {
    const tagChips = wrapper.findAll(TagChip);
    expect(tagChips.length).toEqual(wrapper.vm.$data.colors.length);
    [...Array.from(tagChips.length).keys()].forEach(i => {
      expect(tagChips.at(i).props().color).toEqual(wrapper.vm.$data.colors[i]);
    });
  });
  it("should map its label and color state from props", () => {
    expect(wrapper.vm.$data.selectedColor).toEqual(mockTags[0].color);
    expect(wrapper.vm.$data.newTagLabel).toEqual(mockTags[0].label);
  });
  it("should emit @onColorChange if selectedColor changes", () => {
    wrapper.setData({ selectedColor: "test" });
    expect(wrapper.emitted("onColorChange")).toBeTruthy();
    expect(wrapper.emitted().onColorChange[1]).toEqual(["test"]);
  });
  it("should emit @onLabelChange if newTagLabel changes", () => {
    wrapper.setData({ newTagLabel: "test" });
    expect(wrapper.emitted("onLabelChange")).toBeTruthy();
    expect(wrapper.emitted().onLabelChange[1]).toEqual(["test"]);
  });
});
