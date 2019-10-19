<template>
  <div
    class="columnContainer__header
      py-1
      pr-2
      pl-0
      d-flex
      justify-xs-space-between"
  >
    <v-icon
      v-show="!isTitleEdited"
      color="black"
      class="column-drag-handle mr-1"
      >mdi-drag</v-icon
    >
    <span
      v-if="!isTitleEdited"
      class="flex-grow-1 text-sm-right pr-1 font-weight-bold pr-5"
    >
      {{ title }}
    </span>
    <v-text-field
      v-else
      light
      class="py-0 pl-1"
      v-model="newColumnTitle"
      autofocus
      @blur="$emit('onTitleChange', newColumnTitle)"
    ></v-text-field>
    <v-menu bottom :offset-y="true">
      <template v-slot:activator="{ on }">
        <v-btn class="columnHeader__menu" light icon v-on="on">
          <v-icon size="16">mdi-dots-horizontal</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, i) in menuItems"
          :key="i"
          @click="$emit('onSelectClick', item.id)"
        >
          <v-list-item-title>
            <v-icon size="16" class="mr-1">{{ `mdi-${item.icon}` }}</v-icon
            >{{ item.title }}</v-list-item-title
          >
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: "ListHeader",
  props: {
    title: {
      type: String,
      default: ""
    },
    isTitleEdited: {
      type: Boolean,
      default: false
    },
    menuItems: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    title: {
      immediate: true,
      handler(title) {
        if (title && title.length) {
          this.newColumnTitle = title;
        }
      }
    }
  },
  data() {
    return {
      newColumnTitle: ""
    };
  }
};
</script>

<style lang="stylus">
.columnContainer__header
    position relative
    .v-icon
        cursor grab
        &:active
          cursor grabbing;
</style>
