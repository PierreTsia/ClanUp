import { shallowMount, createLocalVue } from "@vue/test-utils";
import EditCardModal from "@/components/base/EditCardModal";
import EditCardModalHeader from "@/components/base/editCardModal/EditCardModalHeader";
import EditCardModalMenu from "@/components/base/editCardModal/EditCardModalMenu";
import TagMenu from "@/components/base/menus/TagMenu";
import createStub from "./support/createStubWithProps";
import jest from "jest-mock";
import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
Vue.use(Vuetify);

const localVue = createLocalVue();
localVue.use(Vuex);

const editedTag = {
  _id: "existingId",
  board: "boardId",
  color: "#F3D43D",
  label: "test tag 1"
};

describe("EditCardModal.vue", () => {
  const modalProps = {
    card: {
      _id: "1",
      title: "test",
      position: 42,
      columnId: { _id: "columnId", title: "column-test" }
    }
  };

  const actions = {
    upsertCard: () => jest.fn()
  };
  const store = {
    actions,
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
    //given
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

    //when: header component is clicked
    header.vm.$emit("onEditTitleClick");
    await wrapper.vm.$nextTick();

    //then
    expect(wrapper.vm.isCardTitleEdited).toEqual(true);
    expect(
      wrapper.find(EditCardModalHeader).props("isCardTitleEdited")
    ).toEqual(true);
  });

  [
    [modalProps.card.title, false], // same content
    ["newTitle", true] // content changed
  ].forEach(([titleInput, shouldBeCalled]) => {
    it(`should${
      shouldBeCalled ? " " : " not "
    }trigger edit title mutation when header text input is blurred with ${
      shouldBeCalled ? "a different" : "the same"
    } content`, async () => {
      //given
      const wrapper = shallowMount(EditCardModal, {
        localVue,
        store: getStore(),
        stubs: { EditCardModalHader: createStub(EditCardModalHeader) },
        propsData: {
          modalProps
        }
      });
      jest.spyOn(wrapper.vm, "upsertCard");
      await wrapper.vm.$nextTick();
      const header = wrapper.find(EditCardModalHeader);

      //when blur event is edited with  whith changes /no changes
      header.vm.$emit("onBlur", titleInput);
      await wrapper.vm.$nextTick();

      //then it should trigger database mutation with args / should not
      if (shouldBeCalled) {
        expect(wrapper.vm.upsertCard).toHaveBeenCalledWith({
          cardInput: {
            ...modalProps.card,
            columnId: modalProps.card.columnId._id,
            boardId: wrapper.vm.$store.getters.currentBoard._id,
            title: titleInput
          }
        });
      } else {
        expect(wrapper.vm.upsertCard).not.toHaveBeenCalled();
      }
    });
  });

  it("should render CardModal menu and pass items as props", async () => {
    //given
    const wrapper = shallowMount(EditCardModal, {
      localVue,
      store,
      stubs: { EditCardModalMenu: createStub(EditCardModalMenu) },
      propsData: {
        modalProps
      }
    });
    await wrapper.vm.$nextTick();
    const menuProps = wrapper.find(EditCardModalMenu).props();
    expect(Object.keys(menuProps)).toEqual(["editedTag", "menuItems"]);
  });

  [
    ["add_tag", true], //
    ["add_dueDate", false]
  ].forEach(([menuItem, shouldQuery]) => {
    it(`should${
      shouldQuery ? " " : " not "
    }query boardTags if @onMenuClick is emitted with ${
      shouldQuery ? menuItem : "another item"
    } `, async () => {
      //given
      const wrapper = shallowMount(EditCardModal, {
        localVue,
        store: getStore(),
        stubs: { EditCardModalMenu: createStub(EditCardModalMenu) },
        propsData: {
          modalProps
        }
      });
      jest.spyOn(wrapper.vm, "getBoardTags");
      await wrapper.vm.$nextTick();
      const menuCmp = wrapper.find(EditCardModalMenu);
      menuCmp.vm.$emit("onMenuClick", menuItem);
      await wrapper.vm.$nextTick();

      if (shouldQuery) {
        expect(wrapper.vm.getBoardTags).toHaveBeenCalled();
      } else {
        expect(wrapper.vm.getBoardTags).not.toHaveBeenCalled();
      }
    });
  });

  [
    ["add_tag", true], //
    ["add_dueDate", false]
  ].forEach(([menuItemId, shouldShow]) => {
    it(`should${shouldShow ? " " : " not "}show the tagMenu if aciveItemId is ${
      shouldShow ? menuItemId : "another menu item"
    }`, async () => {
      const wrapper = shallowMount(EditCardModal, {
        localVue,
        store: getStore(),
        stubs: { TagMenu: createStub(TagMenu) },
        propsData: {
          modalProps
        }
      });

      wrapper.setData({ activeMenuId: menuItemId });
      await wrapper.vm.$nextTick();
      expect(wrapper.find(TagMenu).exists()).toBe(shouldShow);
    });
  });

  [
    ["0000", "removeTagFromCard", true], //
    ["1111", "addTagToCard", false]
  ].forEach(([tagId, methodName, isAlreadyOnCard]) => {
    it(`should ${
      isAlreadyOnCard ? "remove" : "add"
    } tag to card if @tagSelect is emitted with ${
      isAlreadyOnCard ? "an existing tag" : "a new tag"
    }`, async () => {
      const wrapper = shallowMount(EditCardModal, {
        localVue,
        store: getStore(),
        stubs: { TagMenu: createStub(TagMenu) },
        propsData: {
          modalProps
        }
      });

      jest.spyOn(wrapper.vm, "addTagToCard");
      jest.spyOn(wrapper.vm, "removeTagFromCard");
      const tagMenu = wrapper.find(TagMenu);

      tagMenu.vm.$emit("onTagSelect", { _id: tagId });
      await wrapper.vm.$nextTick();

      expect(wrapper.vm[methodName]).toHaveBeenCalled();
    });
  });

  [
    [false, editedTag],
    [true, { ...editedTag, label: "test tag 1 modified" }]
  ].forEach(([contentHasChanged, newTagContent]) => {
    it(`should${
      contentHasChanged ? " " : " not "
    }upsert a new tag if edited Tag  has${
      contentHasChanged ? " " : " not "
    }ben modified `, async () => {
      const wrapper = shallowMount(EditCardModal, {
        localVue,
        store: getStore(),
        stubs: { TagMenu: createStub(TagMenu) },
        propsData: {
          modalProps
        }
      });
      jest.spyOn(wrapper.vm, "upsertTag");
      const tagMenu = wrapper.find(TagMenu);
      tagMenu.vm.$emit("onTagEdited", editedTag);
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.editedTag).toEqual(editedTag);
      wrapper.setData({ newTag: newTagContent });

      tagMenu.vm.$emit("onConfirmEditTagClick", newTagContent);
      await wrapper.vm.$nextTick();
      if (contentHasChanged) {
        expect(wrapper.vm.upsertTag).toHaveBeenCalled();
      } else {
        expect(wrapper.vm.upsertTag).not.toHaveBeenCalled();
      }
    });
  });
});

const getStore = () =>
  new Vuex.Store({
    state: {},
    actions: {
      upsertCard: jest.fn(),
      getBoardTags: jest.fn(),
      addTagToCard: jest.fn(),
      removeTagFromCard: jest.fn(),
      upsertTag: jest.fn()
    },
    getters: {
      me: () => {},
      allTags: () => [],
      currentBoard: () => ({ _id: "boardId" }),
      currentCard: () => ({
        _id: "1",
        title: "test",
        position: 42,
        columnId: { _id: "column-test" }
      }),
      currentCardTagsIds: () => ["0000"]
    }
  });
