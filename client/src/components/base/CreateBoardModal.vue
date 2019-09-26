<template>
  <v-dialog
    content-class="modal"
    v-model="isShown"
    max-width="800"
    @click:outside="handleClickOutside"
  >
    <v-card color="white">
      <v-layout row wrap class="pa-0 ma-0">
        <v-flex xs12 sm8 class="background">
          <v-img
            v-if="activeBackground.coverImg"
            :src="activeBackground.coverImg"
            height="200"
            position="center bottom"
          />
          <v-card
            v-if="activeBackground.color"
            class="d-flex backgroundColor"
            outlined
            flat
            :color="activeBackground.color"
            min-height="200"
          >
          </v-card>
          <v-form class="form" ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="boardname"
              single-line
              dark
              filled
              label="Board Name"
              color="white"
              required
            ></v-text-field>
            <v-textarea
              filled
              height="100"
              v-model="description"
              dark
              name="input-7-4"
              label="Description"
            ></v-textarea>
          </v-form>
        </v-flex>
        <v-flex xs12 sm4>
          <v-layout row wrap class="d-flex justify-center pa-2 ma-0">
            <Pill
              v-for="(coverImg, index) in options.coverImgs"
              :coverImg="coverImg"
              :key="`coverImg__${index}`"
              @click.native="
                setActiveBackground({ coverImg: coverImg, color: null })
              "
            />
            <Pill
              v-for="(color, index) in options.colors"
              :color="color"
              :key="`color__${index}`"
              @click.native="
                setActiveBackground({
                  color: color,
                  coverImg: null
                })
              "
            />
          </v-layout>
        </v-flex>
      </v-layout>

      <v-card-actions>
        <div class="flex-grow-1"></div>

        <v-btn color="error" text @click="modalProps.onCancelClick()">
          Cancel
        </v-btn>

        <v-btn color="primary" text @click="handleConfirmClick">
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import _ from "lodash";
import Pill from "@/components/base/Pill.vue";
export default {
  name: "CreateBoardModal",
  props: {
    dialog: {
      type: Boolean,
      default: false
    },

    modalProps: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    dialog: {
      immediate: true,
      handler(dialog) {
        this.isShown = dialog;
      }
    }
  },
  components: {
    Pill
  },
  data() {
    return {
      isShown: false,
      valid: true,
      boardname: "My awesome project",
      description:
        "The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through.",
      boardnameRules: [v => !!v || "Board name is required"],
      activeBackground: {
        color: null,
        coverImg: "https://i.ibb.co/s60NwT2/bg-rand5.jpg"
      },
      options: {
        colors: ["#B37B2C", "#B04632", "#0067A3", "#001A29", "#519839"],
        coverImgs: [
          "https://i.ibb.co/s60NwT2/bg-rand5.jpg",
          "https://i.ibb.co/ZVsfdHr/bg-rand4.jpg",
          "https://i.ibb.co/pL56b0Z/bg-rand2.jpg",
          "https://i.ibb.co/HGpP306/bg-rand3.jpg",
          "https://i.ibb.co/wdJh15D/bg-rand1.jpg"
        ]
      }
    };
  },
  methods: {
    handleClickOutside() {
      this.$emit("onClickOutside");
    },
    setActiveBackground({ color, coverImg }) {
      this.activeBackground = { color, coverImg };
    },
    noFieldsAreMissing(boardinput) {
      const requiredFields = ["boardname", "description"].every(attr =>
        Object.keys(boardinput).includes(attr)
      );

      const oneOverTwoFields = ["coverImg", "color"].some(attr =>
        Object.keys(boardinput).includes(attr)
      );
      return requiredFields && oneOverTwoFields;
    },

    handleConfirmClick() {
      const boardinput = _.pickBy({
        boardname: this.boardname,
        description: this.description,
        ...this.activeBackground
      });
      if (this.noFieldsAreMissing(boardinput)) {
        this.modalProps.onConfirmClick({ boardinput });
      }
    }
  }
};
</script>

<style lang="stylus">
.modal
    .pill
        display block
        width 40px
        height 40px
        border-radius 25%
        cursor pointer
        margin-left calc(50% - 20px)
    .background
      position relative
      .form
        position absolute
        width 80%
        top 10px
        left 10%
        .v-text-field__slot
          input
            font-weight bolder
</style>
