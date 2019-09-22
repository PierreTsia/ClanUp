<template>
  <v-card class="login pa-4 mx-auto">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="username"
        :rules="usernameRules"
        :success="isUsernameFree"
        :error="isAlreadyTaken"
        :error-messages="isAlreadyTaken ? 'This Name is already taken' : null"
        label="User Name"
        @input="handleVerifyName"
        required
      ></v-text-field>
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
      <v-text-field
        v-model="password2"
        :rules="password2Rules"
        type="password"
        label="Confirm password"
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
import _ from "lodash";
import { mapActions } from "vuex";
export default {
  name: "SignupForm",
  apollo: {
    // Vue-Apollo options here
    $query: {}
  },
  data: () => ({
    isUserNameAvailable: null,
    valid: true,
    password: "",
    username: "",
    email: "",
    password2: "",
    usernameRules: [
      n => !!n || "User Name is required",
      n => !/\s/.test(n) || "No white spaces allowed",
      n =>
        (n && n.length > 4 && n.length <= 20) ||
        "User name must be between 5 and 20 chars"
    ],
    passwordRules: [
      p => !!p || "Password is required",
      v => (v && v.length <= 10) || "Password must be less than 10 characters"
    ],
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ]
  }),
  computed: {
    isUsernameFree() {
      return (
        this.isUserNameAvailable !== null &&
        this.isUserNameAvailable[this.username]
      );
    },
    isAlreadyTaken() {
      return (
        this.isUserNameAvailable &&
        this.isUserNameAvailable[this.username] === false
      );
    },
    password2Rules() {
      return [
        !!this.password2 || "Confirmation password required",
        !!(
          this.password &&
          this.password2 &&
          this.password === this.password2
        ) || "The two passwords don't match"
      ];
    }
  },
  methods: {
    ...mapActions(["verifyUsername"]),

    validate() {
      if (this.$refs.form.validate()) {
        this.$emit("onValidateSignupClick", {
          username: this.username,
          email: this.email,
          password: this.password
        });
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    handleVerifyName: _.debounce(async function() {
      if (this.username && this.username.length) {
        const isValid = await this.verifyUsername(this.username);
        this.isUserNameAvailable = { [this.username]: isValid };
      }
    }, 250)
  }
};
</script>

<style scoped></style>
