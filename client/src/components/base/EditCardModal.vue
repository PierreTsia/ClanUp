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
      <template v-if="card && card.coverImg">
        <v-img
          class="white--text align-end cardCoverImg"
          max-height="150px"
          :src="card.coverImg"
        >
          <v-icon
            class="deleteCover mr-2 pt-1"
            color="white"
            size="24"
            @click="handleDeleteCoverImg"
            >mdi-delete</v-icon
          >
        </v-img>
      </template>

      <div class="editCardModal__card__header px-4 mt-4">
        <EditCardModalHeader
          :isCardTitleEdited="isCardTitleEdited"
          :columnTitle="columnTitle"
          :cardTitle="newCardTitle"
          @onEditTitleClick="isCardTitleEdited = !isCardTitleEdited"
          @onBlur="handleEditCardTitle"
        />

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
      <v-layout class="editCardModal__card__content mt-4 px-4">
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
              <v-avatar
                v-if="me && me.avatar"
                color="indigo"
                size="36"
                class="avatar"
              >
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

        <EditCardModalMenu
          ref="editCardMenu"
          :menuItems="menuItems"
          :editedTag="editedTag"
          @onMenuClick="handleMenuClick"
          @onCloseClick="handleCloseClick"
        >
          <template slot="menuContent">
            <component
              :is="activeMenu.component"
              :editedTag="editedTag"
              @onTagSelect="handleTagClick"
              @onTagEdited="handleTagIsEdited"
              @onColorChange="handleColorChange"
              @onLabelChange="handleLabelChange"
              @onConfirmEditTagClick="handleConfirmActionMenuClick('add_tag')"
              @onCancelEditTagClick="handleGoBack"
              @onSelectImg="handleImageIsSelected"
              @onImageSaved="handleImageSaved"
            />
          </template>
        </EditCardModalMenu>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  TagMenu,
  DueDateMenu,
  CoverImageMenu
} from "@/components/base/menus/index";

import EditCardModalHeader from "./editCardModal/EditCardModalHeader";
import EditCardModalMenu from "./editCardModal/EditCardModalMenu";
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
    CoverImageMenu,
    EditCardModalHeader,
    EditCardModalMenu
  },
  data() {
    return {
      menus: {
        add_tag: false,
        add_dueDate: false
      },
      activeMenuId: "add_tag",
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
        },
        {
          id: "add_coverImg",
          label: "add cover",
          icon: "mdi-image",
          component: "CoverImageMenu",
          title: "Add a Cover Image"
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
    },
    activeMenu() {
      return this.menuItems.find(i => i.id === this.activeMenuId);
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
    async handleImageSaved({ url }) {
      const cardInput = {
        _id: this.card._id,
        coverImg: url,
        boardId: this.currentBoard._id,
        columnId: this.card.columnId._id
      };
      await this.upsertCard({ cardInput });
    },
    async handleDeleteCoverImg() {
      const cardInput = {
        _id: this.card._id,
        coverImg: null,
        boardId: this.currentBoard._id,
        columnId: this.card.columnId._id
      };
      await this.upsertCard({ cardInput });
      this.card.coverImg = null;
    },
    async handleImageIsSelected(imgUrl) {
      const cardInput = {
        _id: this.card._id,
        coverImg: imgUrl,
        boardId: this.currentBoard._id,
        columnId: this.card.columnId._id
      };
      await this.upsertCard({ cardInput });
      this.card.coverImg = imgUrl;
    },

    async handleMenuClick(itemId) {
      this.activeMenuId = itemId;
      switch (itemId) {
        case "add_tag":
          await this.getBoardTags({ boardId: this.currentBoard._id });
          break;
        default:
          return;
      }
    },
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

    handleBlur(event) {
      if (
        !event.relatedTarget ||
        !event.relatedTarget.classList.contains("commentActionBtn")
      ) {
        this.isCommentFocus = false;
      }
    },
    handleCloseClick(itemId) {
      const menu = this.$refs.editCardMenu.$refs[`menuRef_${itemId}`];
      if (menu && menu[0]) {
        menu[0].isActive = false;
      }
    },
    async handleEditCardTitle(newCardTitle) {
      if (newCardTitle.length && newCardTitle !== this.card.title) {
        this.newCardTitle = newCardTitle;
        const cardInput = {
          _id: this.card._id,
          columnId: this.card.columnId._id,
          position: this.card.position,
          title: this.newCardTitle,
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
      this.$emit("onClose");
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
        position relative
        .cardCoverImg
          &:hover
            .deleteCover
              display block
        .deleteCover
          display none
          position absolute
          left 5px
          top 5px
          cursor pointer
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
                right 15px
                top -5px
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
