<template>
  <div class="login container fill-height container--fluid pa-0">
    <SigninForm
      @onValidateClick="({ email, password }) => login({ email, password })"
    >
      <template slot="alert">
        <v-alert dense outlined type="error">
          I'm a dense alert with the <strong>outlined</strong> prop and a
          <strong>type</strong> of error
        </v-alert>
      </template>
    </SigninForm>
    <SignupForm />
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { SignupForm, SigninForm } from "@/components/login";

export default {
  name: "Login",
  data: () => ({}),
  components: {
    SigninForm,
    SignupForm
  },
  methods: {
    ...mapActions(["login"])
  }
};
</script>
