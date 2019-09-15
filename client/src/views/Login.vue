<template>
  <v-card class="login pa-4 mx-auto">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="E-mail"
        required
      ></v-text-field>
      <v-text-field
        v-model="password"
        :rules="passwordRules"
        type="password"
        label="Password"
        required
      ></v-text-field>

      <v-btn :disabled="!valid" color="primary" class="ma-4" @click="validate">
        Validate
      </v-btn>

      <v-btn color="primary" outlined class="mr-4" @click="reset">
        Reset Form
      </v-btn>
    </v-form>
  </v-card>
</template>
<script>
import { mapActions } from "vuex";

export default {
  name: "Login",
  data: () => ({
    valid: true,
    password: "",
    passwordRules: [
      p => !!p || "Password is required",
      v => (v && v.length <= 10) || "Password must be less than 10 characters"
    ],
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    select: null,
    items: ["Item 1", "Item 2", "Item 3", "Item 4"],
    checkbox: false
  }),

  methods: {
    ...mapActions(["login"]),
    validate() {
      if (this.$refs.form.validate()) {
        this.login({ email: this.email, password: this.password });
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  }
};
</script>
