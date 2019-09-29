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
    <div>
      <Container
        orientation="horizontal"
        @drop="onColumnDrop($event)"
        drag-handle-selector=".column-drag-handle"
        @drag-start="dragStart"
        :drop-placeholder="upperDropPlaceholderOptions"
      >
        <Draggable v-for="column in sortedColumns" :key="column.id">
          <div class="card-container">
            <div class="card-column-header">
              <span class="column-drag-handle">&#x2630;</span>
              {{ column.name }}
            </div>
            <Container
              group-name="col"
              @drop="e => onCardDrop(column.id, e)"
              @drag-start="e => handleDragStart(e)"
              @drag-end="e => handleDragEnd(e)"
              :get-child-payload="getCardPayload(column.id)"
              drag-class="card-ghost"
              drop-class="card-ghost-drop"
              :drop-placeholder="dropPlaceholderOptions"
            >
              <Draggable
                v-for="entry in sortedEntries(column.id)"
                :key="entry.id"
              >
                <v-card light class="card-container mb-2">
                  <h4 class="pa-2">{{ entry.title }}</h4>
                </v-card>
              </Draggable>
            </Container>
          </div>
        </Draggable>
      </Container>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { Container, Draggable } from "vue-smooth-dnd";
import _ from "lodash";

const board = {
  id: "01",
  colOrder: ["col2", "col1", "col3", "col4"],
  columns: [
    {
      id: "col1",
      name: "To Do",
      entriesOrder: ["a2", "a1"],

      entries: [{ id: "a1", title: "a1" }, { id: "a2", title: "a2" }]
    },
    {
      id: "col2",
      name: "Doing",
      entriesOrder: ["b2", "b1"],
      entries: [{ id: "b1", title: "b1" }, { id: "b2", title: "b2" }]
    },
    {
      id: "col3",
      name: "To review",
      entriesOrder: ["c2", "c1", "c3", "c4"],
      entries: [
        { id: "c1", title: "c1" },
        { id: "c2", title: "c2" },
        { id: "c3", title: "c3" },
        { id: "c4", title: "c4" }
      ]
    },
    {
      id: "col4",
      name: "Done",
      entriesOrder: ["d2", "d1", "d3"],
      entries: [
        { id: "d1", title: "d1" },
        { id: "d2", title: "d2" },
        { id: "d3", title: "d3" }
      ]
    }
  ]
};

export default {
  name: "BoardView.vue",
  components: { Container, Draggable },
  watch: {
    boardColumns: {
      immediate: true,
      deep: true,
      handler(newColumns, oldColumns) {
        console.log("news cols", _.difference(newColumns, oldColumns));
      }
    },
    boardColOrder: {
      handler(newOrder, oldOrder) {
        if (newOrder.length && oldOrder.length && newOrder !== oldOrder) {
          //console.log("MUTATE WITH ORDER", newOrder, oldOrder);
        }
      }
    }
  },
  data() {
    return {
      isBoardNameEdited: false,

      newBoardName: "",
      board,
      boardColumns: [],
      boardColOrder: [],
      entriesOrder: {},
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
    ...mapGetters(["currentBoard"]),
    sortedColumns() {
      return [...this.boardColumns].sort((colA, colB) =>
        this.boardColOrder.indexOf(colA.id) >
        this.boardColOrder.indexOf(colB.id)
          ? 1
          : -1
      );
    }
  },
  methods: {
    ...mapActions(["getBoardById", "updateBoard"]),
    async handleUpdateBoardName() {
      const boardInput = { boardname: this.newBoardName };
      await this.updateBoard({ boardId: this.currentBoard._id, boardInput });
      this.isBoardNameEdited = !this.isBoardNameEdited;
    },
    sortedEntries(columId) {
      const column = this.boardColumns.find(col => col.id === columId);
      const sortedEntries = [...column.entries].sort((entryA, entryB) =>
        column.entriesOrder.indexOf(entryA.id) >
        column.entriesOrder.indexOf(entryB.id)
          ? 1
          : -1
      );
      return sortedEntries;
    },
    //eslint-disable-next-line
    handleDragEnd(event) {
      //console.log("drag end", event);
    },
    //eslint-disable-next-line
    handleDragStart(event) {
      //console.log("drag start", event);
    },

    onColumnDrop(dropResult) {
      const { removedIndex, addedIndex } = dropResult;
      const movedItem = this.boardColOrder[removedIndex];
      const pulled = _.pull(
        this.boardColOrder,
        this.boardColOrder[removedIndex]
      );
      const newOrder = [
        ...pulled.slice(0, addedIndex),
        movedItem,
        ...pulled.slice(addedIndex)
      ];

      this.boardColOrder = newOrder;
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
          item: this.sortedEntries(columnId)[index],
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
    this.boardColOrder = this.board.colOrder;
    this.boardColumns = this.board.columns;
    this.entriesOrder = this.board.columns.reduce((entriesOrder, col) => {
      return _.merge(entriesOrder, { [col.id]: col.entriesOrder });
    }, {});
  }
};
</script>

<style lang="stylus">
.boardView
  background-size cover
  .smooth-dnd-container
    width 100%
    .smooth-dnd-draggable-wrapper
      padding 0 0.5rem
  .card-container
    outline 1px solid red

/*  .boardView__top
    outline 1px solid red*/
</style>
