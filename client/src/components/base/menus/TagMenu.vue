<template>
  <v-list>
    <v-list-item v-for="(item, index) in items" :key="index">
      <v-list-item-action>
        <v-switch color="purple"></v-switch>
      </v-list-item-action>
      <v-list-item-title>{{ item.label }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "TagMenu",
  watch: {
    allTags: {
      immediate: true,
      handler(tags) {
        if (tags) {
          this.items = tags;
        }
      }
    }
  },
  computed: {
    ...mapGetters(["allTags"])
  },
  data() {
    return {
      items: []
    };
  }
};
</script>

<style scoped></style>
