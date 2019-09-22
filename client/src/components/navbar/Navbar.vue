<template>
  <v-app-bar app v-if="me" clipped-left>
    <v-app-bar-nav-icon @click.stop="$emit('drawer')"></v-app-bar-nav-icon>
    <div class="flex-grow-1"></div>
    <h5 class="subtitle-3 secondary--text mr-3">{{ me.username }}</h5>
    <v-avatar :size="avatarSize">
      <img :src="me.avatar" alt="avatar" />
    </v-avatar>

    <v-btn icon @click="logout">
      <v-icon color="secondary">mdi-exit-to-app</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Navbar.vue",
  data() {
    return {
      avatarSize: 38
    };
  },
  computed: {
    ...mapGetters(["me"])
  },
  methods: {
    ...mapActions(["logout"])
  }
};
</script>

<style scoped></style>
