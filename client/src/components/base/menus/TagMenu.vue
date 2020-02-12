<template>
  <v-list class="tagMenu">
    <template v-if="!isTagEdited">
      <div class="editedTag_input pl-2 pr-2 mb-5">
        <v-text-field
          v-model="searchQuery"
          outlined
          dense
          flat
          hide-details
          label="Find a tag"
        />
      </div>
      <ExistingTag
        v-for="(tag, index) in displayTags"
        :tag="tag"
        :key="index"
        @onSelect="$emit('onTagSelect', tag)"
        @onEdit="handleTagEdit"
      />

      <div
        class="tagMenu__actions pl-2 pr-7 d-flex justify-center align-end py-2 mt-5"
      >
        <v-chip
          class="tag text-center"
          filter
          color="success"
          label
          @click.native="handleCreateNewClick"
        >
          <div class="d-block mx-auto">
            <v-icon size="16">mdi-plus-circle</v-icon>
            create new
          </div>
        </v-chip>
      </div>
    </template>
    <template v-else>
      <EditedTag
        :tag="editedTag"
        @onLabelChange="label => $emit('onLabelChange', label)"
        @onColorChange="color => $emit('onColorChange', color)"
        @onCancelClick="$emit('onCancelEditTagClick')"
        @onConfirmEditTagClick="$emit('onConfirmEditTagClick')"
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
      cardTags: [],
      searchQuery: ""
    };
  },
  computed: {
    ...mapGetters(["allTags", "currentCardTagsIds", "currentBoard"]),
    displayTags() {
      return !this.searchQuery.length
        ? [...this.allTags].slice(0, 6)
        : [...this.allTags].filter(tag =>
            this.searchTags(tag, this.searchQuery)
          );
    },
    isTagEdited() {
      return this.editedTag && this.editedTag.color;
    }
  },
  methods: {
    searchTags(tag, query) {
      const pattern = new RegExp(query, "gi");
      return pattern.test(tag.label);
    },
    handleTagEdit(tag) {
      this.$emit("onTagEdited", tag);
    },
    handleCreateNewClick() {
      const newTag = {
        color: "#1483BB",
        label: this.searchQuery,
        board: this.currentBoard._id,
        _id: null
      };
      this.handleTagEdit(newTag);
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
        .v-chip__content
          flex-grow 1
</style>
