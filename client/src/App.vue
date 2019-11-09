<template>
  <v-app id="inspire">
    <component
      :is="activeModalName"
      :dialog="isActiveModal(activeModalName)"
      :modalProps="modalProps"
      @onClickOutside="closeModal()"
    ></component>
    <NavigationDrawer :drawer="drawer" @onClickOutside="handleInputChange" />
    <Navbar @drawer="drawer = !drawer" />
    <v-content>
      <div class="fill-height" fluid>
        <router-view></router-view>
      </div>
    </v-content>
  </v-app>
</template>

<script>
import Navbar from "@/components/navbar/Navbar.vue";
import NavigationDrawer from "@/components/base/NavigationDrawer";
import CreateBoardModal from "@/components/base/CreateBoardModal";
import ConfirmModal from "@/components/base/ConfirmModal";
import EditCardModal from "@/components/base/EditCardModal";

import { mapGetters, mapActions } from "vuex";
export default {
  props: {
    source: String
  },
  components: {
    Navbar,
    CreateBoardModal,
    ConfirmModal,
    EditCardModal,
    NavigationDrawer
  },
  data: () => ({
    drawer: false,
    areSettingsShown: false,
    dialog: true
  }),
  watch: {
    me: {
      immediate: true,
      handler(me) {
        console.log(me);
      }
    }
  },
  computed: {
    ...mapGetters([
      "me",
      "isDark",
      "isModalShown",
      "modalProps",
      "activeModalName"
    ])
  },
  methods: {
    ...mapActions(["closeModal", "setAppTheme", "getAppTheme", "getMyBoards"]),

    isActiveModal(modalname) {
      return this.activeModalName === modalname;
    },
    handleInputChange(value) {
      this.drawer = value;
    }
  },
  async created() {
    const theme = await this.getAppTheme();
    this.$vuetify.theme.dark = theme === "dark";
    this.setAppTheme(theme);
    await this.getMyBoards();
  }
};
</script>
<style lang="stylus">
 *{ text-transform: none !important; }
.drawer
  .v-list-item__content
    display flex
    justify-content space-around
    align-items center
    padding 5px 5px 5px 5px
  .drawer__darkmode
    max-width 50%
    margin-bottom 0
    padding-left 10px
  .drawer__darkMode__switch
    margin 0
</style>
