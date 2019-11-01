<template>
  <v-chip
    v-model="isSelected"
    class="colorPills mb-2 white--text"
    :color="color"
    label
    filter
    @click.native="$emit('onSelect', color)"
  >
  </v-chip>
</template>

<script>
export default {
  name: "TagChip",
  props: {
    color: {
      type: String,
      default: ""
    },
    selectedColor: {
      type: String,
      default: ""
    }
  },
  computed: {
    isSelected() {
      return this.color === this.selectedColor;
    }
  }
};
</script>

<style lang="stylus">
.colorPills
    .v-chip__content
        position relative
        left 5px
</style>
