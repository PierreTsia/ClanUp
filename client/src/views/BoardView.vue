<template>
  <div
    :class="['flex-column', 'boardView', 'fill-height', 'pa-1']"
    :style="{
      backgroundColor:
        currentBoard && currentBoard.color ? currentBoard.color : null,
      backgroundImage:
        currentBoard && currentBoard.coverImg
          ? 'url(' + currentBoard.coverImg + ')'
          : null
    }"
  >
    <v-layout v-if="currentBoard" class="boardView__top pa-4">
      <v-flex xs12 sm4>
        <v-btn
          depressed
          color="transparent"
          v-if="!isBoardNameEdited"
          @click="isBoardNameEdited = !isBoardNameEdited"
          >{{ currentBoard.boardname }}</v-btn
        >
        <v-text-field
          v-else
          v-model="newBoardName"
          autofocus
          label="Regular"
          @blur="handleUpdateBoardName"
        ></v-text-field>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "BoardView.vue",
  data() {
    return {
      isBoardNameEdited: false,
      newBoardName: ""
    };
  },
  computed: {
    ...mapGetters(["currentBoard"])
  },
  methods: {
    ...mapActions(["getBoardById", "updateBoard"]),
    async handleUpdateBoardName() {
      const boardInput = { boardname: this.newBoardName };
      await this.updateBoard({ boardId: this.currentBoard._id, boardInput });
      this.isBoardNameEdited = !this.isBoardNameEdited;
    }
  },
  async created() {
    const { id } = this.$route.params;
    await this.getBoardById(id);
    this.newBoardName = this.currentBoard.boardname;
  }
};
</script>

<style lang="stylus">
.boardView
  background-size cover
/*  .boardView__top
    outline 1px solid red*/
</style>
