import * as types from "../mutation-types";
import { sortBy } from "lodash";
import { defaultClient as apolloClient } from "../../main";
import {
  UPSERT_COLUMN,
  NORMALIZE_COLUMNS_ORDER,
  DELETE_COLUMN,
  UPDATE_COLUMN_TITLE
} from "../../../queries";
export const state = {
  currentBoardColumns: [],
  error: null
};
export const getters = {
  boardColumns: state =>
    state.currentBoardColumns.length > 1
      ? sortBy(state.currentBoardColumns, "position")
      : state.currentBoardColumns
};

export const actions = {
  upsertColumn: async ({ commit }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: UPSERT_COLUMN,
        variables: payload
      });
      commit(types.UPSERT_COLUMN_SUCCESS, data.upsertColumn);
      return data.upsertColumn;
    } catch (e) {
      console.warn(e);
    }
  },

  normalizeColumnOrder: async (_, payload) => {
    try {
      await apolloClient.mutate({
        mutation: NORMALIZE_COLUMNS_ORDER,
        variables: payload
      });
    } catch (e) {
      console.warn(e);
    }
  },
  deleteColumn: async ({ commit }, columnId) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: DELETE_COLUMN,
        variables: columnId
      });

      commit(types.DELETE_COLUMN_SUCCESS, data.deleteColumn);
    } catch (e) {
      console.warn(e);
    }
  },
  updateColumnTitle: async ({ commit }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_COLUMN_TITLE,
        variables: payload
      });
      commit(types.UPDATE_COLUMN_TITLE_SUCCESS, data.updateColumnTitle);
    } catch (e) {
      console.warn(e);
    }
  }
};

export const mutations = {
  [types.GET_BOARD_BY_ID_SUCCESS]: (state, board) => {
    const { columns } = board;
    state.currentBoardColumns = columns;
  },
  [types.UPSERT_COLUMN_SUCCESS]: (state, column) => {
    const columnToUpdate = state.currentBoardColumns.find(
      c => c._id === column._id
    );
    if (!columnToUpdate) {
      state.currentBoardColumns = [...state.currentBoardColumns, column];
    } else {
      state.currentBoardColumns = [
        ...state.currentBoardColumns.filter(c => c._id !== column._id),
        column
      ];
    }
  },
  [types.DELETE_COLUMN_SUCCESS]: (state, columnId) => {
    state.currentBoardColumns = state.currentBoardColumns.filter(
      c => c._id !== columnId
    );
  },
  [types.UPDATE_COLUMN_TITLE_SUCCESS]: (state, column) => {
    const columnIndex = state.currentBoardColumns.findIndex(
      c => c._id === column._id
    );

    state.currentBoardColumns[columnIndex] = {
      ...state.currentBoardColumns[columnIndex],
      title: column.title
    };
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
