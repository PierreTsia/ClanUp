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
      class="editCardModal__card accent--text px-4"
    >
      <div class="editCardModal__card__header pt-4">
        <v-flex xs12 class="editCardModal__card__header__text mb-4">
          <span class="d-flex align-center">
            <v-icon class="title mr-2" color="accent" size="24"
              >mdi-subtitles</v-icon
            >

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
              hide-details
              max-width="400px"
              v-model="newCardTitle"
              autofocus
              light
              @blur="handleEditCardTitle"
            ></v-text-field>
          </span>

          <small class="d-block flex-grow-1 accent--text  pl-8 columnName"
            >From list {{ columnTitle }}</small
          >
        </v-flex>
        <v-flex v-if="newCardTags && newCardTags.length">
          <div class=" d-flex flex-grow-1 pl-8 mb-3 cardContentBlock">
            <v-chip
              class="tag white--text mr-2"
              v-for="tag in newCardTags"
              :key="tag._id"
              :color="tag.color"
              label
              close
              @click:close="handleRemoveTagFromCard(tag._id)"
            >
              {{ tag.label.trim().length ? tag.label : `&nbsp;` }}
            </v-chip>
          </div>
        </v-flex>

        <v-flex>
          <div class="cardContentBlock">
            <v-flex class="d-flex justify-start align-start">
              <v-icon class="description mr-2 pt-1" color="accent" size="24"
                >mdi-text-subject</v-icon
              >
              <h3 class="sectionHeader">
                Description
              </h3>
            </v-flex>
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
                class="mb-2 textArea pl-sm-8"
              ></v-textarea>
              <div class="description_actions pl-sm-8">
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
              <small
                v-else
                class="cardDescription--value d-block pl-8 py-3"
                @click="isDescriptionEdited = !isDescriptionEdited"
                >{{ newCardDescription }}</small
              >
            </template>
          </div>
        </v-flex>

        <v-icon
          @click="modalProps.onCancelClick"
          color="accent"
          class="close"
          size="24"
          >mdi-close</v-icon
        >
      </div>
      <v-layout class="editCardModal__card__content mt-4">
        <v-flex class="editCardModal__card__content__cardBody">
          <div class="cardContentBlock">
            <v-flex class="d-flex justify-start align-start mb-2">
              <v-icon class="activities mr-3 pt-1" color="accent" size="24"
                >mdi-format-list-bulleted</v-icon
              >
              <h3 class="sectionHeader">
                Activities
              </h3>
            </v-flex>
            <v-flex xs12 class="d-flex align-center comment pl-sm-5">
              <v-avatar color="indigo" size="36" class="avatar">
                <img :src="me.avatar" alt="avatar" />
              </v-avatar>
              <v-textarea
                v-model="newComment"
                :rows="isCommentFocus ? 5 : 2"
                dense
                solo
                no-resize
                hide-details
                autofocus
                light
                class="ml-5 pa-0 "
                label="Enter comment..."
                @focus="isCommentFocus = true"
                @blur="event => handleBlur(event)"
              ></v-textarea>
              <v-flex v-if="isCommentFocus" class="comment_actions d-flex pa-1">
                <v-btn
                  tile
                  small
                  height="25px"
                  class="success commentActionBtn"
                  @click.stop="isCommentFocus = true"
                  >confirm</v-btn
                >
                <v-btn icon class="commentActionBtn">
                  <v-icon color="accent" size="16">mdi-paperclip</v-icon>
                </v-btn>
                <v-btn icon class="commentActionBtn">
                  <v-icon color="accent" size="16">mdi-mail-ru</v-icon>
                </v-btn>
                <v-btn icon class="commentActionBtn">
                  <v-icon color="accent" size="16">mdi-emoticon-outline</v-icon>
                </v-btn>
              </v-flex>
            </v-flex>
          </div>
        </v-flex>
        <v-flex class="editCardModal__card__content__cardMenu">
          <span class="text-start cardMenu_header px-3">
            Add to the card
          </span>
          <section class="cardMenu_items px-3">
            <v-menu
              :content-class="`menu_${item.id}`"
              :ref="`menuRef_${item.id}`"
              v-for="item in menuItems"
              :key="item.id"
              transition="slide-y-transition"
              offset-y
              :close-on-click="true"
              :close-on-content-click="false"
              nudge-bottom="5"
              bottom
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  class="darkgrey text-left justify-start px-1 mb-2"
                  color="accent"
                  dark
                  @click="handleMenuClick(item.id)"
                  v-on="on"
                >
                  <v-icon color="accent" size="14" class="mr-2">{{
                    item.icon
                  }}</v-icon>
                  {{ item.label }}
                </v-btn>
              </template>
              <ContextualMenu :item="item" @onCloseClick="handleCloseClick">
                <v-list-item-subtitle
                  slot="title"
                  class="d-flex align-center justify-start text-center"
                >
                  <v-icon
                    class="d-block"
                    @click.native="handleGoBack"
                    v-if="editedTag"
                    >mdi-chevron-left</v-icon
                  >
                  <span class="d-block flex-grow-1 text--center">
                    {{ editedTag ? "Edit Tag" : item.title }}
                  </span>
                </v-list-item-subtitle>

                <template slot="menuContent">
                  <component
                    :is="item.component"
                    :editedTag="editedTag"
                    @onTagSelect="handleTagClick"
                    @onTagEdited="handleTagIsEdited"
                    @onColorChange="handleColorChange"
                    @onLabelChange="handleLabelChange"
                  />
                </template>
                <template slot="menuActions" v-if="editedTag">
                  <v-btn color="error" @click="handleCloseClick(item.id)"
                    >Cancel</v-btn
                  >
                  <v-btn
                    color="success"
                    @click="handleConfirmActionMenuClick(item.id)"
                    >Save</v-btn
                  >
                </template>
              </ContextualMenu>
            </v-menu>
          </section>
        </v-flex>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  TagMenu,
  DueDateMenu,
  ContextualMenu
} from "@/components/base/menus/index";
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
    currentCard: {
      deep: true,
      handler(card) {
        if (card) {
          this.card = card;
          this.newCardTitle = card.title;
          this.columnTitle = card.columnId.title;
          this.newCardDescription = card.description || "";
          this.tempCardDescription = card.description || "";
          this.newCardTags = card.tags || [];
        }
      }
    },
    dialog: {
      immediate: true,
      handler(dialog) {
        this.isShown = dialog;
      }
    }
  },
  components: {
    TagMenu,
    DueDateMenu,
    ContextualMenu
  },
  data() {
    return {
      menus: {
        add_tag: false,
        add_dueDate: false
      },
      isShown: false,
      isCardTitleEdited: false,
      isDescriptionEdited: false,
      isCommentFocus: false,
      card: null,
      newCardTitle: "",
      columnTitle: "",
      newCardDescription: "",
      tempCardDescription: "",
      newComment: "",
      newCardTags: [],
      editedTag: null,
      newTag: { color: null, label: null },
      menuItems: [
        {
          id: "add_tag",
          label: "add a tag",
          icon: "mdi-tag-outline",
          component: "TagMenu",
          title: "Add a Tag"
        },
        {
          id: "add_dueDate",
          label: "due date",
          icon: "mdi-clock-outline",
          component: "DueDateMenu",
          title: "Add a Due Date"
        }
      ]
    };
  },
  computed: {
    ...mapGetters([
      "currentBoard",
      "me",
      "allTags",
      "currentCard",
      "currentCardTagsIds"
    ]),
    tagContentHadBeenModified() {
      const oldLabel = this.editedTag.label;
      const oldColor = this.editedTag.color;
      const newLabel = this.newTag.label;
      const newColor = this.newTag.color;

      return (
        newColor && newLabel && (newColor !== oldColor || newLabel !== oldLabel)
      );
    }
  },
  methods: {
    ...mapActions([
      "upsertCard",
      "upsertTag",
      "getBoardTags",
      "addTagToCard",
      "removeTagFromCard"
    ]),
    handleColorChange(color) {
      this.newTag.color = color;
    },
    handleLabelChange(label) {
      this.newTag.label = label;
    },
    async addNewTag() {
      if (this.tagContentHadBeenModified) {
        const newTagInput = { board: this.currentBoard._id, ...this.newTag };
        if (this.editedTag && this.editedTag.board) {
          newTagInput["_id"] = this.editedTag._id;
        }
        await this.upsertTag(newTagInput);
        this.editedTag = null;
      }
    },
    async handleConfirmActionMenuClick(itemId) {
      if (itemId === "add_tag") {
        await this.addNewTag();
      }
    },
    handleGoBack() {
      this.editedTag = null;
    },
    handleTagIsEdited(tag) {
      const { color, label, board, _id } = tag;
      this.editedTag = { color, label, board, _id };
    },
    async handleTagClick(tag) {
      if (!this.currentCardTagsIds.includes(tag._id)) {
        const tagInput = { _id: tag._id, cardId: this.currentCard._id };
        await this.addTagToCard({ tagInput });
      } else {
        await this.removeTagFromCard({
          tagId: tag._id,
          cardId: this.currentCard._id
        });
      }
    },

    async handleRemoveTagFromCard(tagId) {
      await this.removeTagFromCard({ tagId, cardId: this.currentCard._id });
    },

    async handleMenuClick(itemId) {
      switch (itemId) {
        case "add_tag":
          await this.getBoardTags({ boardId: this.currentBoard._id });
          break;
        default:
          return;
      }
    },
    handleBlur(event) {
      if (
        !event.relatedTarget ||
        !event.relatedTarget.classList.contains("commentActionBtn")
      ) {
        this.isCommentFocus = false;
      }
    },
    handleCloseClick(itemId) {
      const menu = this.$refs[`menuRef_${itemId}`];
      if (menu && menu[0]) {
        menu[0].isActive = false;
      }
    },
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
      this.columnTitle = card.columnId.title;
      this.newCardDescription = card.description || "";
      this.tempCardDescription = card.description || "";
      this.newCardTags = card.tags || [];
    }
  }
};
</script>

<style lang="stylus">
@media screen and (min-width:800px )
  .editCardModal
    .editCardModal__card
      .editCardModal__card__content
        flex-direction row !important
        width 100%
        .editCardModal__card__content__cardMenu
          order 2 !important
          flex-grow 1 !important
        .editCardModal__card__content__cardBody
          order 1 !important
          max-width 70%
          .cardContentBlock
            padding-right 20px

          .avatar
            display block



.editCardModal
    .editCardModal__card
        cursor default !important
        display flex
        flex-direction column
        .editCardModal__card__header
            position relative
            display flex
            flex-direction column
            justify-content flex-start
            .cardContentBlock
              position relative
              &:not(:first-child)
                margin-top 30px
              .noDescription
                padding 10px 10px 30px 10px
                display block
                background-color #E2E4E9
                font-size 0.8rem
                border-radius 5px
                cursor pointer
                margin 0 15px 0 35px
              .cardDescription--value
                cursor pointer
                &:hover
                  text-decoration underline
              .tag
                cursor pointer
            .editCardModal__card__header__text
                width 90%
                margin-right auto
                h3
                  padding 0
                  font-size 1.5rem
            .v-icon
              &.close
                position absolute
                right 5px
                top 5px
                cursor pointer
              &.title
                left 5px
                top 20px
        .editCardModal__card__content
            display flex
            flex-direction column
            flex-grow 1
            .avatar
              display none
            .editCardModal__card__content__cardMenu
                flex-grow 0
                order 1
                .cardMenu_header
                  font-size 12px
                  font-weight 500
                  text-transform uppercase
                .cardMenu_items
                  display flex
                  flex-direction column
                  justify-content flex-start

            .editCardModal__card__content__cardBody
                flex-grow 1
                order 2
                .comment
                  position relative
                  .comment_actions
                    position absolute
                    bottom 5px
                    left 85px
                    height 30px
                    width calc(100% - 85px)
</style>
