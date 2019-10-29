<template>
  <v-dialog
    content-class="editCardModal"
    v-model="isShown"
    width="800"
    @click:outside="handleClickOutside"
  >
    <v-card
      color="grey"
      min-height="800"
      class="editCardModal__card accent--text"
    >
      <section class="editCardModal__card__header">
        <div class="editCardModal__card__header__text pr-8">
          <h3
            class="cardTitle"
            v-if="!isCardTitleEdited"
            @click="isCardTitleEdited = !isCardTitleEdited"
          >
            {{ newCardTitle }}
          </h3>
          <v-text-field
            class="textField"
            v-else
            dense
            max-width="400px"
            v-model="newCardTitle"
            autofocus
            light
            @blur="handleEditCardTitle"
          ></v-text-field>

          <span class="accent--text subtitle-2"
            >From list {{ columnTitle }}</span
          >
        </div>

        <v-icon
          @click="modalProps.onCancelClick"
          color="accent"
          class="close"
          size="24"
          >mdi-close</v-icon
        >
        <v-icon class="title" color="accent" size="18">mdi-subtitles</v-icon>
      </section>
      <section class="editCardModal__card__content">
        <div class="editCardModal__card__content__cardBody">
          <div class="cardDescription">
            <v-icon class="description" color="accent" size="18"
              >mdi-text-subject</v-icon
            >
            <h3 class="sectionHeader">
              Description
            </h3>
            <template v-if="isDescriptionEdited">
              <v-textarea
                v-model="newCardDescription"
                solo
                autofocus
                outlined
                flat
                light
                hide-details
                background-color="white"
                no-resize
                name="input-7-4"
                label="Enter card description..."
                class="mb-2"
              ></v-textarea>
              <div class="description_actions">
                <v-btn class="success mx-auto" small color="white">
                  <span
                    class="text-xs-left pr-1 white--text"
                    @click="handleConfirmDescriptionClick"
                  >
                    Confirm
                  </span>
                </v-btn>
                <v-btn icon @click="handleEditDescriptionCancel">
                  <v-icon size="24" color="black">mdi-close</v-icon>
                </v-btn>
              </div>
            </template>
            <template v-else>
              <span
                class="noDescription"
                v-if="!newCardDescription.length"
                @click="isDescriptionEdited = !isDescriptionEdited"
                >Add a detailed description...</span
              >
              <span
                v-else
                class="cardDescription--value py-3"
                @click="isDescriptionEdited = !isDescriptionEdited"
                >{{ newCardDescription }}</span
              >
            </template>
          </div>
        </div>
        <div class="editCardModal__card__content__cardMenu">menu</div>
      </section>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "EditCardModal",
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
  components: {},
  data() {
    return {
      isShown: false,
      isCardTitleEdited: false,
      isDescriptionEdited: false,
      card: null,
      newCardTitle: "",
      columnTitle: "",
      newCardDescription: "",
      tempCardDescription: ""
    };
  },
  computed: {
    ...mapGetters(["currentBoard"])
  },
  methods: {
    ...mapActions(["upsertCard"]),
    async handleEditCardTitle() {
      if (this.newCardTitle.length && this.newCardTitle !== this.card.title) {
        const cardInput = {
          _id: this.card._id,
          title: this.newCardTitle,
          position: this.card.position,
          columnId: this.card.columnId._id,
          boardId: this.currentBoard._id
        };
        await this.upsertCard({ cardInput });
      }
      if (!this.newCardTitle.length) {
        this.newCardTitle = this.card.title;
      }
      this.isCardTitleEdited = !this.isCardTitleEdited;
    },
    async handleConfirmDescriptionClick() {
      if (this.newCardDescription !== this.tempCardDescription) {
        const cardInput = {
          _id: this.card._id,
          description: this.newCardDescription,
          position: this.card.position,
          title: this.newCardTitle,
          columnId: this.card.columnId._id,
          boardId: this.currentBoard._id
        };
        await this.upsertCard({ cardInput });
        this.tempCardDescription = this.newCardDescription;
        this.isDescriptionEdited = !this.isDescriptionEdited;
      }

      /* if (!this.newCardDescription.length) {
        this.newCardDescription = this.tempCardDescription;
      }

      */
    },
    handleClickOutside() {
      this.$emit("onClickOutside");
    },

    handleEditDescriptionCancel() {
      this.newCardDescription = this.tempCardDescription;
      this.isDescriptionEdited = !this.isDescriptionEdited;
    },

    handleConfirmClick() {
      this.modalProps.onConfirmClick();
    }
  },
  mounted() {
    const { card } = this.modalProps;
    if (card) {
      this.card = card;
      this.newCardTitle = card.title;
      this.columnTitle = card.column.title;
      this.newCardDescription = card.description || "";
      this.tempCardDescription = card.description || "";
    }
  }
};
</script>

<style lang="stylus">
.editCardModal
    .editCardModal__card
        cursor default !important
        display flex
        flex-direction column
        .editCardModal__card__header
            height 100px
            position relative
            display flex
            flex-direction column
            justify-content center
            .editCardModal__card__header__text
                width 90%
                margin-left auto
                h3
                  padding 0
                  font-size 1.5rem
            .v-icon
              position absolute
              &.close
                right 5px
                top 5px
                cursor pointer
              &.title
                left 45px
                top 30px
        .editCardModal__card__content
            display flex
            padding-left 80px
            flex-grow 1
            .editCardModal__card__content__cardBody, .editCardModal__card__content__cardMenu
            .editCardModal__card__content__cardMenu
                width 250px
            .editCardModal__card__content__cardBody
                flex-grow 1
                .cardDescription
                    position relative
                    padding-right 20px
                    .noDescription
                      padding 10px 10px 30px 10px
                      display block
                      background-color #E2E4E9
                      width 100%
                      font-size 0.8rem
                      border-radius 5px
                      cursor pointer
                      &:hover
                        text-decoration underline
                    .v-icon
                        &.description
                            position absolute
                            left -35px
                            top 5px
</style>
