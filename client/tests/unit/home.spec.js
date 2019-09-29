import { shallowMount, createLocalVue } from "@vue/test-utils";
import Home from "@/views/Home.vue";
import Boards from "@/components/boards/Boards.vue";
import Vue from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
Vue.use(Vuetify);
import jest from "jest-mock";

const localVue = createLocalVue();
localVue.use(Vuex);
describe("Home.vue", () => {
  let wrapper;
  beforeEach(() => {
    jest.spyOn(actions, "getMyBoards");
    wrapper = shallowMount(Home, {
      stubs: {
        Boards: true
      },
      localVue,
      store: getStore()
    });
  });

  it("should render the component", () => {
    expect(wrapper).toBeDefined();
  });

/*  it("should call get boards query on mounted", () => {
    expect(actions.getMyBoards).toHaveBeenCalled();
  });*/

  it("should render the Boards components", () => {
    expect(wrapper.find(Boards).exists()).toBe(true);
  });
});
const actions = {
  getMyBoards: () => jest.fn()
};
const getStore = () =>
  new Vuex.Store({
    state: {},
    actions,
    getters: {
      boards: () => [
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
      ]
    }
  });
