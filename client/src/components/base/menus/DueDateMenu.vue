<template>
  <v-list>
    <v-list-item v-for="(item, i) in items" :key="i">
      <v-list-item-title>{{ item.title }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: "DueDateMenu",
  data() {
    return {
      items: [
        { title: "DueDate" },
        { title: "Click Me" },
        { title: "Click Me" },
        { title: "Click Me 2" }
      ]
    };
  }
};
</script>

<style scoped></style>
