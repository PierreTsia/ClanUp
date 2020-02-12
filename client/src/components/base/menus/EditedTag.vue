<template>
  <div class="editedTag">
    <div class="editedTag_input px-4">
      <v-text-field
        autofocus
        outlined
        dense
        flat
        hide-details
        label="Nom"
        v-model="newTagLabel"
      ></v-text-field>
    </div>
    <span class="d-flex pa-4 py-2 caption font-weight-bold"
      >Select a color</span
    >
    <v-list-item class="py-0 mt-0 d-flex flex-wrap justify-space-between">
      <TagChip
        v-for="(color, index) in colors"
        :key="index"
        :color="color"
        :selectedColor="selectedColor"
        @onSelect="color => (selectedColor = color)"
      />
    </v-list-item>
    <v-card-actions class="d-flex justify-center">
      <v-btn color="error" @click="$emit('onCancelClick')">Cancel</v-btn>
      <v-btn color="success" @click="$emit('onConfirmEditTagClick')"
        >Save</v-btn
      >
    </v-card-actions>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TagChip from "./TagChip";
export default {
  name: "EditedTag",
  components: {
    TagChip
  },
  props: {
    tag: {
      type: Object,
      default: () => ({
        color: "red",
        label: "",
        _id: null
      })
    }
  },
  watch: {
    selectedColor: {
      handler(color) {
        this.$emit("onColorChange", color);
      }
    },
    newTagLabel: {
      immediate: true,
      handler(label) {
        if (label && label.trim().length) {
          this.$emit("onLabelChange", label);
        }
      }
    }
  },
  data() {
    return {
      selectedColor: "",
      newTagLabel: "",
      colors: [
        "#F3D43D",
        "#FF9D38",
        "#4FBC5A",
        "#F3594C",
        "#C877DB",
        "#0079BA",
        "#33CDE3",
        "#44EBAF",
        "#5E6B81",
        "#FF92D2"
      ]
    };
  },
  computed: {
    ...mapGetters(["currentCardTagsIds"])
  },
  mounted() {
    if (this.tag && this.tag.color) {
      this.selectedColor = this.tag.color;
    }
    if (this.tag && this.tag.label && this.tag.label.trim().length) {
      this.newTagLabel = this.tag.label;
    }
  }
};
</script>

<style lang="stylus">
.editedTag
  .colorPills
    width 48px
    height 32px
    cursor pointer
</style>
