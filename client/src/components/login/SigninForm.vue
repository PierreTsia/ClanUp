<template>
  <v-card class="login pa-4 mx-auto">
    <slot name="alert" />
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
export default {
  name: "SigninForm",
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
    ]
  }),
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.$emit("onValidateClick", {
          email: this.email,
          password: this.password
        });
      }
    },
    reset() {
      this.$refs.form.reset();
    }
  }
};
</script>

<style scoped></style>
