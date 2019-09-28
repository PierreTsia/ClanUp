<template>
  <v-navigation-drawer
    class="drawer"
    v-if="me"
    v-model="isShown"
    @input="handleClickOutside"
    app
    clipped
  >
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
            isDark ? "Dark" : "Light"
          }}</v-list-item-title>
          <v-switch
            v-model="darktheme"
            class="drawer__darkMode__switch"
            append-icon="mdi-theme-light-dark"
            color="primary"
            hide-details
          ></v-switch>
        </v-list-item-content>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "NavigationDrawer",
  props: {
    drawer: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    drawer: {
      immediate: true,
      handler(value, oldvalue) {
        if (value !== oldvalue) {
          this.isShown = value;
        }
      }
    },

    darktheme: {
      handler(isDark) {
        this.$vuetify.theme.dark = isDark;
        const theme = isDark ? "dark" : "light";
        this.setAppTheme(theme);
      }
    }
  },

  data() {
    return {
      isShown: false,
      darktheme: null
    };
  },
  computed: {
    ...mapGetters(["me", "isDark"])
  },
  methods: {
    ...mapActions(["setAppTheme"]),
    handleClickOutside() {
      this.$emit("onClickOutside", this.isShown);
    }
  },
  async mounted() {
    this.darktheme = this.isDark;
  }
};
</script>

<style scoped></style>
