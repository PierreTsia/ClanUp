<template>
  <v-card>
    <v-list-item>
      <v-list-item-content class="py-0">
        <slot name="title" />
      </v-list-item-content>

      <v-list-item-action>
        <v-btn icon @click="$emit('onCloseClick', item.id)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
    <v-divider></v-divider>

    <slot name="menuContent" />
    <v-card-actions class="d-flex justify-center">
      <slot name="menuActions" />
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "ContextualMenu",
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  components: {},
  data() {
    return {
      items: [
        { title: "Tag" },
        { title: "Click Me" },
        { title: "Click Me" },
        { title: "Click Me 2" }
      ]
    };
  }
};
</script>

<style lang="stylus">
.menu_add_tag
    width 300px
</style>
