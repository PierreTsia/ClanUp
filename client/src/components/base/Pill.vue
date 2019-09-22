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
    }
  }
};
</script>

<style lang="stylus" scoped>
.pill
    background-position center
    background-size cover
</style>
