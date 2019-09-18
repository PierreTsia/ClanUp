<template>
  <div :class="['sliderSelector', `sliderSelector--${theme}`]">
    <div
      v-for="item in items"
      :key="item.id"
      :class="[
        'sliderSelector__item',
        `sliderSelector__item--${item.id}`,
        `sliderSelector__item--${theme}`,

        {
          'sliderSelector__item--active': localActiveItemId === item.id,
          'sliderSelector__item--disabled': item.disabled
        }
      ]"
      @click="handleItemClick(item)"
    >
      <slot :item="item">
        <v-icon
          :color="
            isActive(item.id) ? 'white' : $vuetify.theme.dark ? 'grey' : 'black'
          "
          size="14"
        >
          {{ item.icon }}</v-icon
        >
        {{ item.label }}</slot
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "SliderSelector",
  props: {
    items: {
      type: Array,
      default: () => []
    },
    activeItemId: {
      type: String,
      default: null
    }
  },
  watch: {
    activeItemId: {
      immediate: true,
      handler(itemId) {
        this.setActiveItemId(itemId);
      }
    }
  },
  data() {
    return {
      localActiveItemId: null,
      localActiveItemIndex: null
    };
  },
  computed: {
    theme() {
      return this.$vuetify.theme.dark ? "isDark" : "isLight";
    }
  },
  methods: {
    handleItemClick(item) {
      if (item.disabled) {
        return;
      }
      this.setActiveItemId(item.id);
      this.$emit("onItemClick", item);
    },
    isActive(itemId) {
      return itemId === this.localActiveItemId;
    },
    setActiveItemId(itemId) {
      this.localActiveItemId = itemId;
    }
  }
};
</script>
<style lang="stylus" scoped>
.sliderSelector
    display flex
    justify-content center
    align-items center
    box-sizing content-box
    border-radius 12.5px
    min-height 20px
    &.sliderSelector--isDark
        color white
        border 1px solid #90CAF9
    &.sliderSelector--isLight
        color white
        border 1px solid #9C27B0
    .sliderSelector__item
        flex-grow 1
        cursor pointer
        padding 5px 10px
        border-radius 12.5px
        font-size 13px
        text-align center
        transition color 0.2s, background 0.2s

    .sliderSelector__item
        &.sliderSelector__item--isLight
            color black
            &:hover:not(.sliderSelector__item--active):not(.sliderSelector__item--disabled)
                color #9C27B0
                i
                    color #9C27B0 !important
            &.sliderSelector__item--active
                color white
                font-weight 500
                background-color #9C27B0
            &.sliderSelector__item--disabled
                color grey
        &.sliderSelector__item--isDark
            color #90CAF9
                i
                    color #90CAF9
            &:hover:not(.sliderSelector__item--active):not(.sliderSelector__item--disabled)
                color #90CAF9
                i
                    color #90CAF9 !important
            &.sliderSelector__item--active
                color white
                font-weight 500
                background-color #90CAF9
            &.sliderSelector__item--disabled
                color grey
</style>
