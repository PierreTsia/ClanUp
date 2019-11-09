<template>
  <v-flex xs12 class="editCardModal__card__header__text mb-4">
    <span class="d-flex align-center">
      <v-icon class="title mr-2" color="accent" size="24">mdi-subtitles</v-icon>

      <h3
        class="cardTitle"
        v-if="!isCardTitleEdited"
        @click="$emit('onEditTitleClick')"
      >
        {{ cardTitle }}
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
        @blur="$emit('onBlur', newCardTitle)"
      ></v-text-field>
    </span>

    <small class="d-block flex-grow-1 accent--text  pl-8 columnName"
      >From list {{ columnTitle }}</small
    >
  </v-flex>
</template>

<script>
export default {
  name: "EditCardModalHeader.vue",
  props: {
    cardTitle: {
      type: String,
      default: ""
    },
    columnTitle: {
      type: String,
      default: ""
    },
    isCardTitleEdited: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    cardTitle: {
      immediate: true,
      handler(title) {
        if (title && title.length) {
          this.newCardTitle = title;
        }
      }
    }
  },
  data() {
    return {
      newCardTitle: ""
    };
  },
  methods: {
    handleEditCardTitle() {}
  }
};
</script>

<style scoped></style>
