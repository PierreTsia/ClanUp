<template>
  <div class="coverImageMenu">
    <PresetImg
      v-if="!isUploadMode"
      @onSelectPresetImg="imgUrl => $emit('onSelectImg', imgUrl)"
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
          <v-img v-if="isUploaded" contain :src="imgSrc" :max-width="300" />
          <v-img v-else contain :src="placeHolder" :max-width="300" />
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
      return this.uploadedImage.url || "";
    }
  },
  methods: {
    handleClose() {
      this.$emit("onClose");
      this.uploadedImage = null;
    },

    handleImageSaved({ url, public_id }) {
      this.$emit("onImageSaved", { url, public_id });
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
