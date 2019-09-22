<template>
  <div class="home container flex-column">
    <v-layout row wrap>
      <h3 class="text--secondary pl-3">Boards</h3>
      <Boards :boards="boards">
        <template slot="createNewBoard">
          <v-flex class="my-auto ma-auto">
            <div class="slot-text subtitle-2  text-center">
              Create new one
            </div>
          </v-flex>
        </template>
      </Boards>
    </v-layout>
  </div>
</template>

<script>
import Boards from "../components/boards/Boards";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    Boards
  },
  async created() {
    await this.getMyBoards();
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["userHasBoards", "boards"])
  },
  methods: {
    ...mapActions(["getMyBoards"])
  }
};
</script>
<style lang="stylus">
.home
  .slot-text
    color white
</style>
