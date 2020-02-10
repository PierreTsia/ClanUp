<template>
  <v-list class="defaultImages">
    <v-list-item>
      <div class="grid">
        <div
          class="grid-item"
          v-for="(imgUrl, index) in defaultImgUrls"
          :key="index"
        >
          <v-img
            :lazy-src="imgUrl"
            :src="imgUrl"
            aspect-ratio="1"
            max-width="160px"
            max-height="160px"
            @click="$emit('onSelectPresetImg', imgUrl)"
          />
        </div>
      </div>
    </v-list-item>
    <span class="separator text--accent text--center mt-2">or</span>
    <v-list-item>
      <v-list-item-title>
        <v-chip
          class="text-center"
          filter
          color="success"
          label
          @click="handleUploadImage"
        >
          <div class="d-block mx-auto d-flex justify-center">
            <v-icon size="16">mdi-upload</v-icon>
            <span class="flex-grow-1">
              upload your own image
            </span>
          </div>
        </v-chip>
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: "PresetImg",
  data() {
    return {
      defaultImgUrls: IMG_DEFAULTS
    };
  },
  methods: {
    handleUploadImage() {
      this.$emit("onUploadImg");
    }
  }
};
const IMG_DEFAULTS = [
  "https://res.cloudinary.com/dopecloud/image/upload/v1573487232/inspire2_qaeat1.jpg",
  "https://res.cloudinary.com/dopecloud/image/upload/v1573487225/travel2_qu9j9y.jpg",
  "https://res.cloudinary.com/dopecloud/image/upload/v1573487210/travel3_ke5rce.jpg",
  "https://res.cloudinary.com/dopecloud/image/upload/v1573487190/business3_yyt2uw.jpg",
  "https://res.cloudinary.com/dopecloud/image/upload/v1573487189/inspire5_y8xn2n.jpg",
  "https://res.cloudinary.com/dopecloud/image/upload/v1573487187/inspire4_lbxk4s.jpg",
  "https://res.cloudinary.com/dopecloud/image/upload/v1573487176/inspire3_mg34el.jpg",
  "https://res.cloudinary.com/dopecloud/image/upload/v1573487170/code2_e5hqkf.jpg",
  "https://res.cloudinary.com/dopecloud/image/upload/v1573487171/business4_hv8i3p.jpg",
  "https://res.cloudinary.com/dopecloud/image/upload/v1573487168/business5_tfaeog.jpg",
  "https://res.cloudinary.com/dopecloud/image/upload/v1573487153/code1_qgayml.jpg",
  "https://res.cloudinary.com/dopecloud/image/upload/v1573487134/business1_evi2fv.jpg"
];
</script>

<style lang="stylus">
.defaultImages
    .v-chip__content
      width 100%
    .separator
        display block
        text-align center
        width 100%
        font-size 0.8rem
        padding 0
        position relative

    .grid
        display grid
        width 100%
        min-height 400px
        min-width 350px
        grid-template-columns: repeat(12, 1fr)
        grid-template-rows: repeat(12, 1fr)
        .grid-item
            margin auto
            grid-column span 4
            grid-row span 4
            width 100%
            height 100%
            .v-image
                width 100%
                height 100%
        @media screen and (max-width: 600px)
            min-width  20px
            .grid-item
              grid-column span 6
              grid-row span 3
</style>
