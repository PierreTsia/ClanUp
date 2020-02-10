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
          class="white--text boardView__top__edit"
          v-if="!isBoardNameEdited"
          @click="isBoardNameEdited = !isBoardNameEdited"
          >{{ currentBoard.boardname }}</v-btn
        >
        <v-text-field
          v-else
          dark
          class="boardView__top__input"
          v-model="newBoardName"
          autofocus
          label="Regular"
          @blur="handleUpdateBoardName"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <div class="columns">
      <section>
        <Container
          orientation="horizontal"
          @drop="onColumnDrop($event)"
          drag-handle-selector=".column-drag-handle"
          class="columnsDropContainer"
          @drag-start="dragStart"
          :drop-placeholder="upperDropPlaceholderOptions"
        >
          <v-flex xs12 sm3 class="addList">
            <v-card light class="card-container mb-2">
              <v-card-text class>
                <v-text-field
                  v-model="newColumnTitle"
                  autofocus
                  light
                  append-icon="mdi-plus"
                  label="Create a new list"
                  placeholder="To do"
                  @click:append="handleCreateColumn"
                ></v-text-field>
              </v-card-text>
            </v-card>
          </v-flex>

          <template v-if="boardColumns.length">
            <Draggable v-for="column in sortedColumns" :key="column._id">
              <div class="columnContainer mx-2 px-1">
                <ListHeader
                  :title="column.title"
                  :isTitleEdited="isTitleEdited(column._id)"
                  :menuItems="items"
                  @onTitleChange="
                    newTitle => handleTitleChange(newTitle, column._id)
                  "
                  @onSelectClick="
                    menuItemId =>
                      handleMenuSelectClick({
                        columnId: column._id,
                        menuItemId
                      })
                  "
                />
                <Container
                  group-name="col"
                  class="px-1"
                  @drop="e => onCardDrop(column._id, e)"
                  @drag-start="e => handleDragStart(e)"
                  @drag-end="e => handleDragEnd(e)"
                  :get-child-payload="getCardPayload(column._id)"
                  drag-class="card-ghost"
                  drop-class="card-ghost-drop"
                  :drop-placeholder="dropPlaceholderOptions"
                >
                  <Draggable
                    v-for="card in sortedByPosition(
                      cardsByColumnsId[column._id]
                    )"
                    :key="card._id"
                    @click.native="handleCardClick(card._id)"
                  >
                    <v-card light class="card-container mb-2">
                      <h4 class="pa-2">{{ card.title }}</h4>
                    </v-card>
                  </Draggable>
                </Container>
                <ListFooter
                  :isEditing="isNewCardEditingColumnId === column._id"
                  @onCancel="isNewCardEditingColumnId = null"
                  @onEditCardClick="setEditedCard(column._id)"
                  @onCardCreate="
                    ({ title }) =>
                      handleCreateCard({ title, columnId: column._id })
                  "
                />
              </div>
            </Draggable>
          </template>
        </Container>
      </section>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { sortBy, flatMap } from "lodash";
import { Container, Draggable } from "vue-smooth-dnd";
import ListHeader from "@/components/board/ListHeader";
import ListFooter from "@/components/board/ListFooter";

import _ from "lodash";

export default {
  name: "BoardView.vue",
  components: { Container, Draggable, ListHeader, ListFooter },
  watch: {
    boardId: {
      immediate: true,
      async handler(newBoardId, oldBoardId) {
        if (!oldBoardId && newBoardId) {
          await this.getBoardById(newBoardId);
        }
      }
    },
    boardColumns: {
      handler(newColumns, oldColumns) {
        if (oldColumns && newColumns.length !== oldColumns.length) {
          this.columns = [...newColumns];
        }
      }
    },
    currentBoardCards: {
      deep: true,
      handler(boardCards) {
        this.cardsByColumnsId = _.groupBy(
          boardCards,
          card => card.columnId._id
        );
      }
    }
  },
  data() {
    return {
      boardId: null,
      items: [
        { id: "edit", title: "Edit list title", icon: "pencil" },
        { id: "delete", title: "Delete list", icon: "delete" }
      ],
      MAGIC_NUMBER: 1000000,
      isBoardNameEdited: false,
      isNewCardEditingColumnId: null,
      editedTitleColumnId: null,
      newColumnTitle: "",
      newBoardName: "",
      boardColOrder: [],
      entriesOrder: {},
      columns: [],
      cardsByColumnsId: {},
      upperDropPlaceholderOptions: {
        className: "cards-drop-preview",
        animationDuration: "150",
        showOnTop: true
      },
      dropPlaceholderOptions: {
        className: "drop-preview",
        animationDuration: "150",
        showOnTop: true
      }
    };
  },
  computed: {
    ...mapGetters(["currentBoard", "boardColumns", "me", "currentBoardCards"]),

    sortedColumns() {
      return _.sortBy(this.columns, "position");
    }
  },
  methods: {
    ...mapActions([
      "getBoardById",
      "getCardById",
      "updateBoard",
      "updateColumnTitle",
      "upsertColumn",
      "normalizeColumnOrder",
      "deleteColumn",
      "upsertCard",
      "normalizeCardOrder",
      "openModal",
      "closeModal"
    ]),
    setEditedCard(columnId) {
      this.isNewCardEditingColumnId = columnId;
    },
    isTitleEdited(columnId) {
      return this.editedTitleColumnId === columnId;
    },
    sortedByPosition(cards) {
      return sortBy(cards, "position");
    },
    async handleCreateCard({ title, columnId }) {
      const cardInput = {
        title,
        columnId,
        boardId: this.currentBoard._id,
        position: this.lastPosition(this.cardsByColumnsId[columnId])
      };
      await this.upsertCard({ cardInput });
      this.isNewCardEditingColumnId = null;
    },
    async handleTitleChange(newTitle, columnId) {
      try {
        await this.updateColumnTitle({ columnId, title: newTitle });
        const indexToUpdate = this.columns.findIndex(c => c._id === columnId);

        this.$set(this.columns, indexToUpdate, {
          ...this.columns[indexToUpdate],
          title: newTitle
        });
      } catch (e) {
        console.warn(e);
      }

      this.editedTitleColumnId = "";
    },
    async handleMenuSelectClick({ menuItemId, columnId }) {
      if (menuItemId === "delete") {
        await this.deleteColumn({ columnId });
      } else if (menuItemId === "edit") {
        this.editedTitleColumnId = columnId;
      }
    },
    async handleUpdateBoardName() {
      const boardInput = { boardname: this.newBoardName, owner: this.me._id };
      await this.updateBoard({ boardId: this.currentBoard._id, boardInput });
      this.isBoardNameEdited = !this.isBoardNameEdited;
    },
    async handleCardClick(cardId) {
      const card = await this.getCardById({ cardId });

      this.openModal({
        name: "edit-card-modal",
        props: {
          card,
          onConfirmClick: async cardInput => {
            console.log(cardInput);
            // this.closeModal();
          },
          onCancelClick: () => {
            this.closeModal();
          }
        }
      });
    },
    lastPosition(collection) {
      return !collection || !collection.length
        ? this.MAGIC_NUMBER
        : collection[collection.length - 1].position + this.MAGIC_NUMBER;
    },
    async handleCreateColumn() {
      const columnInput = {
        boardId: this.currentBoard._id,
        title: this.newColumnTitle,
        position: this.lastPosition(this.boardColumns),
        createdDate: new Date()
      };
      await this.upsertColumn({ columnInput });
      this.newColumnTitle = "";
    },
    //eslint-disable-next-line
    handleDragEnd(event) {
      //console.log("drag end", event);
    },
    //eslint-disable-next-line
    handleDragStart(event) {
      //console.log("drag start", event);
    },

    getNewPosition(to, from, collection) {
      let newPosition;
      if (to === 0) {
        newPosition = Math.round(collection[0].position / 2);
      } else if (to === collection.length - 1) {
        newPosition = this.lastPosition(collection);
      } else if (to < from) {
        const diff = collection[to].position - collection[to - 1].position;
        newPosition = Math.round(collection[to - 1].position + diff / 2);
      } else {
        const diff = collection[to + 1].position - collection[to].position;
        newPosition = Math.round(collection[to].position + diff / 2);
      }

      return newPosition;
    },

    async onColumnDrop(dropResult) {
      //eslint-disable-next-line
      const { removedIndex, addedIndex, ...args } = dropResult;
      const from = removedIndex - 1;
      const to = addedIndex - 1;
      const newColumnPosition = this.getNewPosition(
        to,
        from,
        this.sortedColumns
      );
      const boardId = this.currentBoard._id;
      //eslint-disable-next-line
      const { _id, title, position, ...columnFields } = this.sortedColumns[
        from
      ];
      const columnInput = {
        _id,
        title,
        boardId,
        position: newColumnPosition
      };
      this.updateColumnPosition({ ...columnInput });
      await this.upsertColumn({ columnInput });
    },

    updateColumnPosition({ _id, position }) {
      const colToUpdateIndex = this.columns.findIndex(c => c._id === _id);
      this.$set(this.columns, colToUpdateIndex, {
        ...this.columns[colToUpdateIndex],
        position
      });
    },

    onCardDrop(columnId, dropResult) {
      const { removedIndex, addedIndex, payload } = dropResult;
      if (removedIndex === null && addedIndex === null) {
        return;
      }
      if (removedIndex !== null && addedIndex !== null) {
        this.moveCardInsideSameColumn({ payload, removedIndex, addedIndex });
      }
      if (removedIndex !== null && addedIndex === null) {
        this.removeCardFromColumn({ removedIndex, columnId, payload });
      }
      if (removedIndex === null && addedIndex !== null) {
        this.addCardToColumn({ payload, addedIndex, columnId });
      }
    },

    dragStart() {
      //  console.log("drag started");
    },

    getCardPayload(columnId) {
      return index => {
        return {
          item: this.sortedByPosition(this.cardsByColumnsId[columnId])[index],
          origin: columnId
        };
      };
    },

    async moveCardInsideSameColumn({ payload, removedIndex, addedIndex }) {
      const columnCards = this.sortedByPosition(
        this.cardsByColumnsId[payload.origin]
      );
      let newPosition;
      if (addedIndex === 0) {
        newPosition = Math.round(columnCards[0].position / 2);
      } else if (addedIndex === columnCards.length - 1) {
        newPosition = this.lastPosition(columnCards);
      } else {
        newPosition = this.getNewPosition(
          addedIndex,
          removedIndex,
          columnCards
        );
      }
      const { _id, title } = payload.item;

      const cardInput = {
        columnId: payload.origin,
        _id,
        title,
        position: newPosition,
        boardId: this.currentBoard._id
      };
      this.$set(
        this.cardsByColumnsId[cardInput.columnId],
        this.cardsByColumnsId[cardInput.columnId].findIndex(
          c => c._id === cardInput._id
        ),
        cardInput
      );
      await this.upsertCard({ cardInput });
    },

    removeCardFromColumn({ columnId, payload }) {
      this.cardsByColumnsId[payload.origin] = this.cardsByColumnsId[
        columnId
      ].filter(c => c._id !== payload.item._id);
    },
    getNewCardPosition(destinationIndex, collection) {
      let newPosition;
      if (destinationIndex === 0) {
        newPosition = collection.length
          ? Math.round(collection[0].position / 2)
          : this.MAGIC_NUMBER;
      } else if (destinationIndex === collection.length) {
        newPosition = this.lastPosition(collection);
      } else {
        const before = collection[destinationIndex - 1].position;
        const after = collection[destinationIndex].position;
        newPosition = before + (after - before) / 2;
      }
      return newPosition;
    },
    insertNewCard(collection, addedIndex, newCard) {
      return collection && collection.length
        ? [
            ...collection.slice(0, addedIndex),
            newCard,
            ...collection.slice(addedIndex)
          ]
        : [newCard];
    },
    async addCardToColumn({ payload, addedIndex, columnId }) {
      const columnCards = this.sortedByPosition(
        this.cardsByColumnsId[columnId]
      );
      const { _id, title } = payload.item;
      const newPosition = this.getNewCardPosition(addedIndex, columnCards);
      const cardInput = {
        columnId,
        _id,
        position: newPosition,
        title,
        boardId: this.currentBoard._id
      };
      this.cardsByColumnsId[columnId] = this.insertNewCard(
        this.cardsByColumnsId[columnId],
        addedIndex,
        cardInput
      );

      await this.upsertCard({ cardInput });
    }
  },
  async mounted() {
    const { id } = this.$route.params;
    this.boardId = id;
    await this.getBoardById(id);
    this.newBoardName = this.currentBoard.boardname;
    if (this.currentBoard.columns) {
      this.columns = this.currentBoard.columns;
    }
    if (this.currentBoardCards && this.currentBoardCards.length) {
      this.cardsByColumnsId = _.groupBy(
        this.currentBoardCards,
        card => card.columnId._id
      );
    }
  },
  async beforeDestroy() {
    const columnIds = this.sortedColumns.map(({ _id }) => _id);
    await this.normalizeColumnOrder({ columnIds });
    const cardOrderInputs = flatMap(
      Object.entries(this.cardsByColumnsId),
      ([columnId, cards]) =>
        sortBy(cards, "position").map(({ _id }, index) => ({
          position: (index + 1) * this.MAGIC_NUMBER,
          _id,
          columnId
        }))
    );
    await this.normalizeCardOrder({ cardOrderInputs });
  }
};
</script>

<style lang="stylus">
.boardView
  background-size cover
  .columns
    .addList
      min-width 200px
      max-width 200px
    .columnsDropContainer
      min-width 100%
      display flex
      overflow-x auto
      min-height 85vh
    .columnContainer
      border-radius 5px
      background-color #EBECF0
      color #314261
      width 200px

      .columnHeader__menu
        position absolute
        right -5px
        top -1px
        .v-icon
          cursor pointer
      .card-container
          cursor pointer
.card-ghost
  cursor grabbing !important
  opacity 0.9
  transform rotate(7deg)
</style>
