<template>
  <v-list class="tagMenu">
    <template v-if="!isTagEdited">
      <ExistingTag
        v-for="(tag, index) in displayTags"
        :tag="tag"
        :key="index"
        @onSelect="$emit('onTagSelect', tag)"
        @onEdit="handleTagEdit"
      />
    </template>
    <template v-else>
      <EditedTag
        :tag="editedTag"
        @onLabelChange="label => $emit('onLabelChange', label)"
        @onColorChange="color => $emit('onColorChange', color)"
      />
    </template>
  </v-list>
</template>

<script>
import ExistingTag from "@/components/base/menus/ExistingTag";
import EditedTag from "@/components/base/menus/EditedTag";
import { mapGetters } from "vuex";
export default {
  name: "TagMenu",
  watch: {
    allTags: {
      immediate: true,
      handler(tags) {
        if (tags) {
          this.cardTags = tags;
        }
      }
    }
  },
  components: {
    ExistingTag,
    EditedTag
  },
  props: {
    editedTag: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      value: true,
      cardTags: []
    };
  },
  computed: {
    ...mapGetters(["allTags", "currentCardTagsIds"]),
    displayTags() {
      return [...this.allTags].slice(0, 6);
    },
    isTagEdited() {
      return this.editedTag && this.editedTag.color;
    }
  },
  methods: {
    handleTagEdit(tag) {
      this.$emit("onTagEdited", tag);
    }
  }
};
</script>

<style lang="stylus">
.tagMenu
    .tagContainer
        min-height 40px
        padding 0 2px
    .v-chip
        &.tag
            width 100%
            cursor pointer
</style>
