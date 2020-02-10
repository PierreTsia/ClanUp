import { shallowMount, createLocalVue } from "@vue/test-utils";
import CoverImageMenu from "@/components/base/menus/CoverImageMenu";
import PresetImg from "@/components/base/menus/PresetImg";
import UploadImage from "@/components/base/UploadImage";

import createStub from "./support/createStubWithProps";

import Vue from "vue";
import Vuetify from "vuetify";

Vue.use(Vuetify);

const localVue = createLocalVue();

describe("EditCardModalMenu.vue", () => {
  it("should render component", () => {
    const wrapper = shallowMount(CoverImageMenu, {
      localVue
    });
    expect(wrapper).toBeDefined();
  });

  [false, true].forEach(isUploadMode => {
    it(`should show ${
      isUploadMode ? "upload image component" : "preset images component"
    } if in upload mode is ${isUploadMode}`, async () => {
      const wrapper = shallowMount(CoverImageMenu, {
        localVue,
        stubs: {
          PresetImgStub: createStub(PresetImg),
          UploadStub: createStub(UploadImage)
        }
      });
      wrapper.setData({ isUploadMode });
      await wrapper.vm.$nextTick();
      const presetImg = wrapper.find(PresetImg);
      const uploadStub = wrapper.find(UploadImage);
      expect(presetImg.exists()).toBe(!isUploadMode);
      expect(uploadStub.exists()).toBe(isUploadMode);
    });
  });

  it("should set uploadedImage when @uploaded is emitted", async () => {
    // given
    const wrapper = shallowMount(CoverImageMenu, {
      localVue,
      stubs: {
        UploadStub: createStub(UploadImage)
      }
    });
    wrapper.setData({ isUploadMode: true });
    const testImg = { url: "test" };
    const uploadStub = wrapper.find(UploadImage);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.$data.uploadedImage).toEqual(null);
    expect(wrapper.vm.imgSrc).toEqual("");
    expect(!!wrapper.vm.isUploaded).toEqual(false);

    //when
    uploadStub.vm.$emit("uploaded", testImg);

    //then
    expect(wrapper.vm.$data.uploadedImage.url).toEqual(testImg.url);
    expect(wrapper.vm.imgSrc).toEqual(testImg.url);
    expect(!!wrapper.vm.isUploaded).toEqual(true);
  });

  [
    [{ url: "test" }, true], //
    ["test", false]
  ].forEach(([payload, shouldEmit]) => {
    it(`should ${shouldEmit ? "" : "not"} emit @onImageSaved when receiving ${
      shouldEmit ? "good" : "bad"
    } payload`, async () => {
      // given
      const wrapper = shallowMount(CoverImageMenu, {
        localVue,
        stubs: {
          UploadStub: createStub(UploadImage)
        }
      });
      wrapper.setData({ isUploadMode: true });
      const uploadStub = wrapper.find(UploadImage);
      await wrapper.vm.$nextTick();

      //when
      uploadStub.vm.$emit("onImageSaved", payload);

      //then
      if (shouldEmit) {
        expect(wrapper.emitted("onImageSaved")).toBeTruthy();
        expect(wrapper.emitted().onImageSaved[0]).toEqual([payload]);
      } else {
        expect(wrapper.emitted("onImageSaved")).not.toBeTruthy();
      }
    });
  });
  [
    ["test", true], //
    [undefined, false]
  ].forEach(([payload, shouldEmit]) => {
    it(`should ${shouldEmit ? "" : "not"} emit @onSelectImg when receiving ${
      shouldEmit ? "good" : "bad"
    } payload`, async () => {
      // given
      const wrapper = shallowMount(CoverImageMenu, {
        localVue,
        stubs: {
          PresetImgStub: createStub(PresetImg)
        }
      });
      const presetImgStub = wrapper.find(PresetImg);
      await wrapper.vm.$nextTick();

      //when
      presetImgStub.vm.$emit("onSelectPresetImg", payload);

      //then
      if (shouldEmit) {
        expect(wrapper.emitted("onSelectImg")).toBeTruthy();
        expect(wrapper.emitted().onSelectImg[0]).toEqual([payload]);
      } else {
        expect(wrapper.emitted("onSelectImg")).not.toBeTruthy();
      }
    });
  });
});
