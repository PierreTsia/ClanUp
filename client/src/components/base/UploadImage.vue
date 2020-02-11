<template>
  <div class="uploadImage">
    <slot name="imgPreview" />
    <v-flex class="d-flex justify-center align-end pb-5">
      <v-chip
        v-if="!uploading && isLocalFileSelected"
        class="text-center my-2 uploaded_action_btn"
        filter
        color="success"
        label
        @click.native="sendFileToCloudinary"
      >
        <v-icon size="16" class="mr-2">mdi-check</v-icon>
        Confirm </v-chip
      ><v-chip
        v-if="!uploading && !isLocalFileSelected"
        class="text-center my-2 uploaded_action_btn"
        filter
        color="success"
        label
        @click.native="selectFiles"
      >
        <div class="d-block mx-auto">
          <v-icon size="16">mdi-upload</v-icon>
          Upload image
        </div>
      </v-chip>
      <input
        id="files"
        type="file"
        name="file"
        ref="uploadInput"
        accept="image/*"
        :multiple="false"
        @change="uploadFiles($event)"
      />
    </v-flex>
    <v-flex class="pa-5 d-flex justify-center align-center" v-if="uploading">
      <v-progress-linear
        v-if="progress < 100"
        class="mt-2"
        :value="progress"
        buffer-value="0"
        color="primary"
        height="10"
        striped
      />
      <v-flex v-else class="d-flex ">
        <v-chip
          class="text-center mr-1 uploaded_action_btn"
          color="warning"
          label
          @click="handleReupload"
        >
          <v-icon size="16">mdi-upload</v-icon>
          Upload again
        </v-chip>
      </v-flex>
    </v-flex>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import UploadImgService from "../../utils/uploadImgService";
export default {
  name: "UploadImage",
  props: {
    value: {
      type: String
    }
  },
  watch: {
    uploadedFile: {
      immediate: true,
      handler(upload) {
        if (upload) {
          this.isLocalFileSelected = true;
          this.$emit("uploaded", upload);
        }
      }
    }
  },
  data() {
    return {
      uploading: null,
      progress: 0,
      imgPublicId: "",
      isLocalFileSelected: false,
      uploadedFile: null,
      url: null,
      public_id: null
    };
  },
  computed: {
    ...mapGetters(["me"])
  },
  methods: {
    handleReupload() {
      this.uploading = false;
      this.uploadedFile = null;
      this.selectFiles();
    },
    selectFiles() {
      this.$refs.uploadInput.click();
    },

    sendFileToCloudinary() {
      if (
        !this.uploadedFile ||
        !this.uploadedFile.files ||
        !this.uploadedFile.files.length
      ) {
        return;
      }
      this.uploading = true;
      const callback = (...args) => {
        const [key, payload] = args;
        if (key === "in progress") {
          this.progress = payload;
        }
        if (key === "uploaded") {
          const { url, public_id } = payload;
          this.$emit("onImageSaved", { url, public_id });
        }
      };
      const upload = new UploadImgService(this.uploadedFile.files[0], callback);
      upload.sendFiles();
    },
    async uploadFiles(e) {
      let files = e.target.files || e.dataTransfer.files;
      const localeImg = { url: URL.createObjectURL(files[0]) };
      this.uploadedFile = { ...localeImg, files: [files[0]] };
    }
  }
};
</script>

<style scoped lang="stylus">
input[type="file"] {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
.v-chip, .uploadImage
    width 100%
    cursor pointer
.uploadImage
    min-height 300px
    display flex
    flex-direction column
    justify-content space-between
</style>
