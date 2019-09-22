<template>
  <div class="login container fill-height container--fluid pa-0">
    <SliderSelector
      :items="forms"
      activeItemId="signup-form"
      @onItemClick="handleFormChange"
    />
    <v-layout column wrap>
      <v-flex xs12>
        <component
          :is="activeComponentId"
          @onValidateSigninClick="
            ({ email, password }) => login({ email, password })
          "
          @onValidateSignupClick="userInput => signup({ userInput })"
          class="login__card"
        ></component>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { SignupForm, SigninForm } from "@/components/login";
import SliderSelector from "@/components/base/SliderSelector";

export default {
  name: "Login",
  data: () => ({
    activeComponent: "SignupForm",
    activeComponentId: "signup-form",
    forms: [
      {
        id: "signin-form",
        icon: "mdi-account-key",
        label: "Signin"
      },
      {
        id: "signup-form",
        icon: "mdi-account-edit",
        label: "Signup"
      }
    ]
  }),
  components: {
    SigninForm,
    SignupForm,
    SliderSelector
  },
  methods: {
    ...mapActions(["login", "signup"]),
    handleFormChange(tab) {
      this.activeComponentId = tab.id;
    }
  }
};
</script>
<style lang="stylus">
.login
  display flex
  flex-direction column
  justify-content center
  align-items center
  position relative
.login__card
  margin-top 100px
  position relative
.sliderSelector
  margin-top 50px
</style>
