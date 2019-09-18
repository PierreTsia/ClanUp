<template>
  <v-app id="inspire">
    <v-navigation-drawer class="drawer" v-model="drawer" app clipped>
      <v-list>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>

          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>

        <v-list-group prepend-icon="mdi-settings" value="true">
          <template v-slot:activator>
            <v-list-item-title>Settings</v-list-item-title>
          </template>

          <v-list-item-content>
            <v-list-item-title :class="['drawer__darkmode']">{{
              darkmode ? "Dark" : "Light"
            }}</v-list-item-title>
            <v-switch
              v-model="darkmode"
              class="drawer__darkMode__switch"
              append-icon="mdi-theme-light-dark"
              color="primary"
              hide-details
            ></v-switch>
          </v-list-item-content>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>
    <v-content>
      <v-container class="fill-height" fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  watch: {
    darkmode: {
      immediate: true,
      handler(mode) {
        this.$vuetify.theme.dark = mode;
      }
    }
  },
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    areSettingsShown: false,
    darkmode: false,
    admins: [
      ["Management", "mdi-people_outline"],
      ["Settings", "mdi-settings"]
    ],
    cruds: [
      ["Create", "add"],
      ["Read", "insert_drive_file"],
      ["Update", "update"],
      ["Delete", "delete"]
    ]
  }),
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
