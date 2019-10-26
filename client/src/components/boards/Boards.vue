<template>
  <v-container class="pa-2" fluid>
    <v-layout row wrap>
      <Board
        v-for="board in boards"
        :key="board._id"
        :board="board"
        :hover="isActive(board._id)"
        @onMouseEnter="handleMouseEnter"
        @onMouseLeave="handleMouseLeave"
        @onDeleteClick="handleDeleteClick"
        @click.native.stop="handleBoardClick(board._id)"
      />

      <v-flex xs12 sm3 md2>
        <v-hover v-slot:default="{ hover: createNewIsHover }">
          <v-card
            class="ma-4 d-flex createNewBoard"
            outlined
            flat
            :color="createNewIsHover ? `accent` : 'background'"
            :elevation="createNewIsHover ? 10 : 1"
            max-height="100px"
            min-height="100px"
            @click="handleCreateNewBoardClick"
          >
            <slot name="createNewBoard" />
          </v-card>
        </v-hover>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Board from "@/components/boards/Board";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Boards.vue",
  props: {
    boards: {
      type: Array,
      default: () => []
    }
  },
  components: {
    Board
  },
  computed: {
    ...mapGetters(["me"])
  },
  data() {
    return {
      createNewIsHover: false,
      activeBoardId: null,
      boardIsHover: false,
      defaultImgUrls: [
        "https://i.ibb.co/wdJh15D/bg-rand1.jpg",
        "https://i.ibb.co/s60NwT2/bg-rand5.jpg",
        "https://i.ibb.co/ZVsfdHr/bg-rand4.jpg",
        "https://i.ibb.co/pL56b0Z/bg-rand2.jpg",
        "https://i.ibb.co/HGpP306/bg-rand3.jpg"
      ],
      defaultColors: ["#B37B2C", "#B04632", "#0067A3", "#001A29"]
    };
  },
  methods: {
    ...mapActions([
      "openModal",
      "closeModal",
      "createBoard",
      "deleteBoardById"
    ]),
    handleCreateNewBoardClick() {
      this.openModal({
        name: "create-board-modal",
        props: {
          onConfirmClick: async boardinput => {
            await this.createBoard(boardinput);
            this.closeModal();
          },
          onCancelClick: () => {
            this.closeModal();
          }
        }
      });
    },
    handleBoardClick(boardId) {
      this.$router.push(`/board/${boardId}`);
    },
    isActive(boardId) {
      return boardId === this.activeBoardId;
    },
    setActiveBoard({ boardId }) {
      this.activeBoardId = boardId;
    },
    handleMouseEnter(boardId) {
      this.setActiveBoard({ boardId });
    },
    handleMouseLeave() {
      this.setActiveBoard({ boardId: null });
    },
    handleDeleteClick(board) {
      if (!board) {
        return;
      }
      this.openModal({
        name: "confirm-modal",
        props: {
          title: "Delete board",
          message: `Are your sure you want to delete ${board.boardname} ?`,
          onConfirmClick: async () => {
            await this.deleteBoardById(board._id);
            this.closeModal();
          },
          onCancelClick: () => {
            this.closeModal();
          }
        }
      });
    }
  }
};
</script>

<style lang="stylus">
.v-card
  transition all ease-in 0.3
  position relative
  &:hover
    cursor pointer
  .boardName
    position absolute
    bottom 0
</style>
