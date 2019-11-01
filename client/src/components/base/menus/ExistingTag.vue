<template>
  <v-list-item class="tagContainer py-0 pl-2">
    <v-chip
      class="tag white--text"
      v-model="isActive"
      filter
      :color="tag.color"
      label
      @click.native="$emit('onSelect', tag)"
    >
      {{ tag.label }}
    </v-chip>
    <v-btn small icon @click="$emit('onEdit', tag)"
      ><v-icon size="16">mdi-pencil-outline</v-icon></v-btn
    >
  </v-list-item>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "ExistingTag",
  props: {
    tag: {
      type: Object,
      default: () => ({
        color: "red",
        label: "",
        _id: null
      })
    }
  },
  computed: {
    ...mapGetters(["currentCardTagsIds"]),
    isActive() {
      return !!(
        this.currentCardTagsIds &&
        this.currentCardTagsIds.length &&
        this.currentCardTagsIds.includes(this.tag._id)
      );
    }
  }
};
</script>

<style lang="stylus"></style>
