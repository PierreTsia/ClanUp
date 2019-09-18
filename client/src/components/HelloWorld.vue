<template>
  <v-container>
    <v-card>
      <v-card-title>
        <h2 v-show="me" class="heading">Welcome back {{ me.username }}</h2>
      </v-card-title>
      <v-card-actions class="pa-4">
        <v-btn color="error" class="mx-auto logout" @click="handleLogout"
          >Log out</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "HelloWorld",
  data: () => ({}),
  computed: {
    ...mapGetters(["me"])
  },
  methods: {
    ...mapActions(["logout"]),
    handleLogout() {
      this.logout();
    }
  }
};
</script>
