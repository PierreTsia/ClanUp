<template>
  <v-flex xs2 sm2 md2 class="d-flex justify-center my-1 mx-1">
    <span
      class="pill"
      :style="{
        backgroundColor: color ? color : null,
        backgroundImage: coverImg ? 'url(' + coverImg + ')' : null
      }"
    ></span>
  </v-flex>
</template>

<script>
export default {
  name: "Pill",
  props: {
    color: {
      type: String,
      default: ""
    },
    coverImg: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="stylus" scoped>
.pill
    min-height 25px
    min-width 35px
    border-radius 5px
    display block
    background-position center
    background-size cover
</style>
