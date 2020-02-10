<template>
  <div class="coverImageMenu">
    <PresetImg
      v-if="!isUploadMode"
      class="preset_img"
      @onSelectPresetImg="handleSelectPresetImg"
      @onUploadImg="handleUploadMode"
    />

    <v-list-item v-else>
      <UploadImage
        @uploaded="handleInputChange"
        @error="handleError"
        @onImageSaved="handleImageSaved"
        @onClose="handleClose"
      >
        <div slot="imgPreview">
          <v-img
            v-if="isUploaded"
            contain
            :src="imgSrc"
            :max-width="300"
            class="imagePreview"
          />
          <v-img
            v-else
            contain
            :src="placeHolder"
            :max-width="300"
            class="imagePreview--placeholder"
          />
        </div>
      </UploadImage>
    </v-list-item>
  </div>
</template>

<script>
import UploadImage from "../UploadImage";
import PresetImg from "./PresetImg";
const IMG_URL =
  "https://ilimvecihad.com/upload/images/cache/placeHolder/placeHolder.png";
export default {
  name: "CoverImageMenu",
  components: { PresetImg, UploadImage },
  data() {
    return {
      uploadedImage: null,
      isUploadMode: false,
      placeHolder: IMG_URL
    };
  },
  computed: {
    isUploaded() {
      return !!this.uploadedImage && this.uploadedImage.url;
    },
    imgSrc() {
      return (this.uploadedImage && this.uploadedImage.url) || "";
    }
  },
  methods: {
    handleClose() {
      this.$emit("onClose");
      this.uploadedImage = null;
    },
    handleSelectPresetImg(imgUrl) {
      if (imgUrl) {
        this.$emit("onSelectImg", imgUrl);
      }
    },
    handleImageSaved({ url }) {
      if (url) {
        this.$emit("onImageSaved", { url });
      }
    },
    handleUploadMode() {
      this.isUploadMode = true;
    },
    handleInputChange(uploaded) {
      this.uploadedImage = uploaded;
    },
    handleError(e) {
      console.warn(e);
    },
    selectFiles() {
      return this.$refs.uploadInput.click();
    }
  }
};
</script>

<style lang="stylus">
.coverImageMenu
  #files
    display none
  .v-chip
    width 100%
    cursor pointer
</style>
