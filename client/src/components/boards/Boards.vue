<template>
  <v-container class="pa-2" fluid>
    <v-layout row wrap>
      <v-flex xs12 sm4 lg3 v-for="board in boards" :key="board._id">
        <v-card
          :class="['ma-4', 'd-flex', 'board']"
          max-height="100px"
          min-height="100px"
          :color="board.color ? board.color : null"
        >
          <v-img
            v-if="board.coverImg"
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
      <v-flex xs12 sm3 md2>
        <v-hover v-slot:default="{ hover: createNewIsHover }">
          <v-card
            class="ma-4 d-flex"
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
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Boards.vue",
  computed: {
    ...mapGetters(["boards", "me"])
  },
  data() {
    return {
      createNewIsHover: false,
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
    ...mapActions(["openModal", "closeModal", "createBoard"]),
    handleCreateNewBoardClick() {
      console.log("create");
      this.openModal({
        name: "create-board",
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
    }
  }
};
</script>

<style lang="stylus" scoped>
.v-card
  transition all ease-in 0.3
  position relative
  &:hover
    cursor pointer
  .boardName
    position absolute
    bottom 0
</style>
