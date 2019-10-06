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
          class="white--text"
          v-if="!isBoardNameEdited"
          @click="isBoardNameEdited = !isBoardNameEdited"
          >{{ currentBoard.boardname }}</v-btn
        >
        <v-text-field
          v-else
          dark
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
                <div
                  class="columnContainer__header py-1 pr-2 pl-0 d-flex justify-xs-space-between"
                >
                  <v-icon color="black" class="column-drag-handle mr-1"
                    >mdi-drag</v-icon
                  >
                  <span class="flex-grow-1 text-sm-right pr-1 font-weight-bold">
                    {{ column.title }}
                  </span>
                </div>
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
                  <!--<Draggable
                    v-for="entry in sortedEntries(column.id)"
                    :key="entry.id"
                  >
                    <v-card light class="card-container mb-2">
                      <h4 class="pa-2">{{ entry.title }}</h4>
                    </v-card>
                  </Draggable>-->
                </Container>
                <div
                  class="columnContainer__footer py-1 d-flex justify-xs-center"
                >
                  <v-btn
                    depressed
                    class="transparent mx-auto"
                    small
                    color="black"
                  >
                    <v-icon color="black" size="16" class="mr-1"
                      >mdi-plus</v-icon
                    >
                    <span class="text-xs-left pr-1 black--text">
                      Add card
                    </span>
                  </v-btn>
                </div>
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
import { Container, Draggable } from "vue-smooth-dnd";
import _ from "lodash";

export default {
  name: "BoardView.vue",
  components: { Container, Draggable },
  watch: {},
  data() {
    return {
      MAGIC_NUMBER: 1000000,
      isBoardNameEdited: false,
      newColumnTitle: "",
      newBoardName: "",
      boardColOrder: [],
      entriesOrder: {},
      columns: [],
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
    ...mapGetters(["currentBoard", "boardColumns", "me"]),

    sortedColumns() {
      return _.sortBy(this.columns, "position");
    }
  },
  methods: {
    ...mapActions([
      "getBoardById",
      "updateBoard",
      "upsertColumn",
      "normalizeColumnOrder"
    ]),
    async handleUpdateBoardName() {
      const boardInput = { boardname: this.newBoardName, owner: this.me._id };
      await this.updateBoard({ boardId: this.currentBoard._id, boardInput });
      this.isBoardNameEdited = !this.isBoardNameEdited;
    },
    getPosition() {
      return !this.boardColumns.length
        ? this.MAGIC_NUMBER
        : this.boardColumns[this.boardColumns.length - 1].position +
            this.MAGIC_NUMBER;
    },
    async handleCreateColumn() {
      console.log(this.currentBoard);
      const columnInput = {
        boardId: this.currentBoard._id,
        title: this.newColumnTitle,
        position: this.getPosition(),
        createdDate: new Date()
      };
      await this.upsertColumn({ ...columnInput });
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

    async onColumnDrop(dropResult) {
      //eslint-disable-next-line
      const { removedIndex, addedIndex, ...args } = dropResult;
      const from = removedIndex - 1;
      const to = addedIndex - 1;
      let newColumnPosition;
      if (to === 0) {
        newColumnPosition = Math.round(this.sortedColumns[0].position / 2);
      } else if (to === this.sortedColumns.length - 1) {
        newColumnPosition =
          this.sortedColumns[this.sortedColumns.length - 1].position +
          this.MAGIC_NUMBER;
      } else if (to < from) {
        const diff =
          this.sortedColumns[to].position - this.sortedColumns[to - 1].position;
        newColumnPosition = newColumnPosition = Math.round(
          this.sortedColumns[to - 1].position + diff / 2
        );
      } else {
        const diff =
          this.sortedColumns[to + 1].position - this.sortedColumns[to].position;
        newColumnPosition = newColumnPosition = Math.round(
          this.sortedColumns[to].position + diff / 2
        );
      }

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
        this.removeCardFromColumn({ removedIndex, columnId });
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
          item: this.boardColumns[index],
          origin: columnId
        };
      };
    },
    moveCardInsideSameColumn({ payload, removedIndex, addedIndex }) {
      const column = this.boardColumns.find(col => col.id === payload.origin);
      const movedItem = column.entriesOrder[removedIndex];
      const pulledOrder = _.pull(
        column.entriesOrder,
        column.entriesOrder[removedIndex]
      );

      const newOrder = [
        ...pulledOrder.slice(0, addedIndex),
        movedItem,
        ...pulledOrder.slice(addedIndex)
      ];

      column.entriesOrder = newOrder;
    },
    removeCardFromColumn({ removedIndex, columnId }) {
      const columnIndex = this.boardColumns.findIndex(
        col => col.id === columnId
      );
      const oldEntries = this.sortedEntries(columnId);
      const newEntries = oldEntries.filter(
        entry => oldEntries.indexOf(entry) !== removedIndex
      );
      this.$set(this.boardColumns, columnIndex, {
        ...this.boardColumns[columnIndex],
        entries: newEntries,
        entriesOrder: newEntries.map(e => e.id)
      });
    },

    addCardToColumn({ payload, addedIndex, columnId }) {
      const columnIndex = this.boardColumns.findIndex(
        col => col.id === columnId
      );
      const oldEntries = this.sortedEntries(columnId);
      const newEntries = [
        ...oldEntries.slice(0, addedIndex),
        payload.item,
        ...oldEntries.slice(addedIndex, oldEntries.length)
      ];

      this.$set(this.boardColumns, columnIndex, {
        ...this.boardColumns[columnIndex],
        entries: newEntries,
        entriesOrder: newEntries.map(e => e.id)
      });
    }
  },
  async created() {
    const { id } = this.$route.params;
    await this.getBoardById(id);
    this.newBoardName = this.currentBoard.boardname;
    if (this.currentBoard.columns) {
      this.columns = this.currentBoard.columns;
    }
  },
  async beforeDestroy() {
    const columnIds = this.sortedColumns.map(({ _id }) => _id);
    await this.normalizeColumnOrder({ columnIds });
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
      min-height 60vh
    .columnContainer
      border-radius 5px
      background-color #EBECF0
      color #314261
      width 200px
      .columnContainer__header
        .v-icon
          cursor grab
          &:active
            cursor grabbing
      .card-container
          cursor grab
</style>
