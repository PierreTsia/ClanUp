import { shallowMount, createLocalVue } from "@vue/test-utils";
import UploadImage from "@/components/base/UploadImage";
import mockEvent from "./mocks/mockEvent";
import Vue from "vue";
import Vuetify from "vuetify";
Vue.use(Vuetify);
import jest from "jest-mock";

const localVue = createLocalVue();
describe("UploadImage.vue", () => {
  it("should render the component", () => {
    const wrapper = shallowMount(UploadImage, { localVue });
    expect(wrapper).toBeDefined();
  });

  it("should display an upload button with upload click event", async () => {
    const wrapper = shallowMount(UploadImage, { localVue });
    jest.spyOn(wrapper.vm, "selectFiles");
    const btn = wrapper.find(".uploaded_action_btn");

    await wrapper.vm.$nextTick();
    expect(btn).toBeDefined();
    btn.trigger("click");
    expect(wrapper.vm.selectFiles).toHaveBeenCalled();
  });

  it("should have an hidden upload input", () => {
    //given
    global.URL.createObjectURL = jest.fn();
    const wrapper = shallowMount(UploadImage, { localVue });
    jest.spyOn(wrapper.vm, "uploadFiles");
    jest.spyOn(wrapper.vm, "sendFileToCloudinary");

    expect(wrapper.vm.$data.uploadedFile).toEqual(null);
    const upload = wrapper.find("#files");

    expect(upload).toBeDefined();
    expect(wrapper.vm.$data.isLocalFileSelected).toEqual(false);

    //when
    upload.trigger("change", mockEvent);

    //then
    expect(wrapper.vm.uploadFiles).toHaveBeenCalled();
    expect(wrapper.vm.$data.uploadedFile).toEqual({
      files: [undefined],
      url: undefined
    });

    expect(wrapper.vm.$data.isLocalFileSelected).toEqual(true);
    expect(wrapper.emitted("uploaded")).toBeTruthy();

    const sendBtn = wrapper.find(".uploaded_action_btn");
    expect(sendBtn.exists()).toBe(true);
    sendBtn.trigger("click");
    expect(wrapper.vm.sendFileToCloudinary).toHaveBeenCalled();
  });
});
