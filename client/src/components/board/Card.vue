<template>
  <v-card light class="card-container mb-2">
    <v-flex
      v-if="card.tags && card.tags.length"
      class="d-flex justify-start pa-2"
    >
      <span
        v-for="(tag, index) in card.tags"
        :key="index"
        class="cardTag"
        :style="{ backgroundColor: tag.color }"
      />
    </v-flex>
    <v-img v-if="card.coverImg" height="200px" :src="card.coverImg"></v-img>
    <h4 class="pa-2 body-2">{{ card.title | truncate }}</h4>
  </v-card>
</template>

<script>
export default {
  name: "Card",
  props: {
    card: {
      type: Object,
      default: () => {}
    }
  },
  filters: {
    truncate: value => {
      if (!value) return "";
      return value.length > 50 ? `${value.slice(0, 50)}...` : value;
    }
  }
};
</script>

<style scoped lang="stylus">
.cardTag
    display block
    min-height 5px
    width 30px
    border-radius 15px
    margin-right 5px
</style>
