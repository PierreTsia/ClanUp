<template>
  <v-list class="tagMenu pl-2">
    <TagLabel
      v-for="(tag, index) in displayTags"
      :tag="tag"
      :key="index"
      @onSelect="$emit('onTagSelect', tag)"
    />
  </v-list>
</template>

<script>
import TagLabel from "@/components/base/menus/TagLabel.vue";
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
    TagLabel
  },
  data() {
    return {
      value: true,
      cardTags: [],
      defaultTags: [
        { label: "", color: "#F3D43D" },
        { label: "", color: "#FF9D38" },
        { label: "", color: "#4FBC5A" },
        { label: "", color: "#F3594C" },
        { label: "", color: "#C877DB" },
        { label: "", color: "#0079BA" }
      ]
    };
  },
  computed: {
    ...mapGetters(["allTags", "currentCardTagsIds"]),
    displayTags() {
      return [...this.allTags, ...this.defaultTags].slice(0, 6);
    }
  },
  methods: {}
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
