<template>
  <div class="columnContainer__footer py-1 d-flex  justify-xs-center">
    <div v-if="isEditing">
      <v-textarea
        v-model="cardTitle"
        autofocus
        light
        background-color="white"
        @blur="handleBlur"
        placeholder="Enter a title for this card..."
      ></v-textarea>
    </div>
    <div>
      <v-btn
        v-show="isEditing"
        @click="handleAddCard"
        depressed
        class="success mx-auto"
        small
        color="white"
      >
        <v-icon color="white" size="16" class="mr-1">mdi-plus</v-icon>
        <span class="text-xs-left pr-1 white--text">
          Add card
        </span>
      </v-btn>
      <v-btn icon v-show="isEditing" @click="$emit('onCancel')">
        <v-icon size="24" color="black">mdi-close</v-icon>
      </v-btn>
      <v-btn
        @click="$emit('onEditCardClick')"
        v-show="!isEditing"
        depressed
        class="transparent mx-auto"
        small
        color="black"
      >
        <v-icon color="black" size="16" class="mr-1">mdi-plus</v-icon>
        <span class="text-xs-left pr-1 black--text">
          Add card
        </span>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListFooter",
  props: {
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cardTitle: ""
    };
  },
  methods: {
    handleAddCard() {
      if (this.cardTitle.length > 3) {
        this.$emit("onCardCreate", { title: this.cardTitle });
        this.newCardTitle = "";
      }
    },
    handleBlur() {
      if (!this.cardTitle.length) {
        this.$emit("onCancel");
      }
    }
  }
};
</script>

<style lang="stylus">
.columnContainer__footer
  display flex
  flex-direction column
</style>
