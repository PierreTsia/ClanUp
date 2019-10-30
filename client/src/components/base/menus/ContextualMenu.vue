<template>
  <v-card>
    <v-list-item>
      <v-list-item-content class="py-0">
        <v-list-item-subtitle>{{ item.title }}</v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-action>
        <v-btn icon @click="$emit('onCloseClick', item.id)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
    <v-divider></v-divider>

    <slot name="menuContent" />

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="menu = false">Cancel</v-btn>
      <v-btn color="primary" text @click="menu = false">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "TagMenu",
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

<style scoped></style>
