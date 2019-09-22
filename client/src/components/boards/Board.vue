<template>
  <v-flex
    xs12
    sm4
    lg3
    @mouseenter="$emit('onMouseEnter', board._id)"
    @mouseleave="$emit('onMouseLeave', board._id)"
  >
    <v-card
      :class="['ma-4', 'd-flex', 'board', { hover: hover }]"
      max-height="100px"
      min-height="100px"
      :elevation="hover ? 12 : 1"
      :color="board && board.color ? board.color : null"
    >
      <v-icon
        v-show="hover"
        color="white"
        @click.stop="$emit('onDeleteClick', board)"
        >mdi-delete</v-icon
      >
      <v-img
        v-if="board && board.coverImg"
        class="white--text"
        height="100px"
        :lazy-src="board.coverImg"
      ></v-img>
      <v-card-text class="boardName pb-0 pl-1">
        <div class="subtitle-2 white--text font-weight-bold ">
          {{ board.boardname }}
        </div>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  name: "Board.vue",
  props: {
    board: {
      type: Object,
      default: () => {}
    },
    hover: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped lang="stylus">
.board
    position relative
    .v-icon
        position absolute
        z-index 2
        right 1.2rem
        top 1rem
</style>
