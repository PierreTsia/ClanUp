<template>
  <div class="home container flex-column">
    <v-layout row>
      <h1>board view</h1>
    </v-layout>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "BoardView.vue",
  async created() {
    const { id } = this.$route.params;
    await this.getBoardById(id);
  },
  methods: {
    ...mapActions(["getBoardById"])
  }
};
</script>

<style scoped></style>
