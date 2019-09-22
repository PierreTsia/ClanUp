<template>
  <v-app id="inspire">
    <CreateBoardModal
      :dialog="isActiveModal('create-board')"
      :modalProps="modalProps"
      @onClickOutside="closeModal()"
    />

    <NavigationDrawer :drawer="drawer" @onClickOutside="handleInputChange" />
    <Navbar @drawer="drawer = !drawer" />
    <v-content>
      <v-container class="fill-height" fluid>
        <v-layout row>
          <router-view></router-view>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Navbar from "@/components/navbar/Navbar.vue";
import NavigationDrawer from "@/components/base/NavigationDrawer";
import CreateBoardModal from "@/components/base/CreateBoardModal";

import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  props: {
    source: String
  },
  components: {
    Navbar,
    CreateBoardModal,
    NavigationDrawer
  },
  data: () => ({
    drawer: false,
    areSettingsShown: false,

    dialog: true
  }),
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
    ...mapMutations({ toggleDarkmode: "APP_DARK_MODE" }),
    ...mapActions(["closeModal"]),

    isActiveModal(modalname) {
      return this.activeModalName === modalname;
    },
    handleInputChange(value) {
      this.drawer = value;
    }
  },
  created() {
    // this.$vuetify.theme.dark = true;
  }
};
</script>
<style lang="stylus">
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
