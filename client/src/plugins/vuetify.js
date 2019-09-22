import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
  options: {
    customProperties: true
  },
  theme: {
    themes: {
      light: {
        primary: colors.purple,
        secondary: colors.grey.darken1,
        accent: colors.purple.lighten2,
        error: colors.red.accent3,
        background: colors.indigo.base
      },
      dark: {
        primary: colors.blue.lighten3,
        secondary: colors.grey.lighten2,
        background: colors.indigo.darken2,
        accent: colors.blue.darken2,

      }
    }
  },
  icons: {
    iconfont: "mdi"
  }
});
