<template>
  <v-flex class="editCardModal__card__content__cardMenu">
    <span class="text-start cardMenu_header px-3">
      Add to the card
    </span>
    <section class="cardMenu_items px-3">
      <v-menu
        :content-class="`menu_${item.id}`"
        :ref="`menuRef_${item.id}`"
        v-for="item in menuItems"
        :key="item.id"
        transition="slide-y-transition"
        offset-y
        :close-on-click="true"
        :close-on-content-click="false"
        nudge-bottom="5"
        bottom
      >
        <template v-slot:activator="{ on }">
          <v-btn
            text
            class="darkgrey text-left justify-start px-1 mb-2"
            color="accent"
            dark
            @click="$emit('onMenuClick', item.id)"
            v-on="on"
          >
            <v-icon color="accent" size="14" class="mr-2">{{
              item.icon
            }}</v-icon>
            {{ item.label }}
          </v-btn>
        </template>

        <v-card>
          <v-list-item>
            <v-list-item-content class="py-0">
              <v-list-item-subtitle
                class="d-flex align-center justify-start text-center"
              >
                <v-icon
                  class="d-block"
                  @click.native="handleGoBack"
                  v-if="editedTag"
                  >mdi-chevron-left</v-icon
                >
                <span class="d-block flex-grow-1 text--center">
                  {{ editedTag ? "Edit Tag" : item.title }}
                </span>
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon @click.stop="$emit('onCloseClick', item.id)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider></v-divider>
          <slot name="menuContent" />
        </v-card>
      </v-menu>
    </section>
  </v-flex>
</template>

<script>
export default {
  name: "EditCardModalMenu",
  props: {
    menuItems: {
      type: Array,
      default: () => []
    },
    editedTag: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

<style scoped></style>
