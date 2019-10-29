<template>
  <v-dialog
    content-class="confirm-modal"
    v-model="isShown"
    max-width="400"
    @click:outside="handleClickOutside"
  >
    <v-card>
      <v-card-title class="headline">{{ modalProps.title }}</v-card-title>
      <v-card-text>
        {{ modalProps.message }}
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn
          class="ma-2"
          outlined
          tile
          color="error"
          @click="modalProps.onCancelClick()"
        >
          Cancel
        </v-btn>
        <v-btn
          class="ma-2"
          tile
          color="error"
          @click="modalProps.onConfirmClick()"
        >
          <v-icon left>mdi-delete</v-icon> Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ConfirmModal",
  props: {
    dialog: {
      type: Boolean,
      default: false
    },

    modalProps: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    dialog: {
      immediate: true,
      handler(dialog) {
        this.isShown = dialog;
      }
    }
  },
  components: {},
  data() {
    return {
      isShown: false
    };
  },
  methods: {
    handleClickOutside() {
      this.$emit("onClickOutside");
    },

    handleConfirmClick() {
      this.modalProps.onConfirmClick();
    }
  }
};
</script>
