<template>
  <v-app>
    <v-card width="600" class="mx-auto mt-5">
      <v-card-title style="background-color:#BDBDBD">
        <h1 class="display-1">Login</h1>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field
            label="Username"
            prepend-icon="mdi-account-circle"
            v-model="username"
          />
          <v-text-field
            :type="showPassword ? 'text' : 'password'"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            label="Password"
            @click:append="showPassword = !showPassword"
            v-model="password"
          />
          <v-btn color="info" :to="'/home'">Login</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-app>
</template>

<script>
export default {
  name: "Login",
  data: () => ({
    showPassword: false,
    username: "",
    password: "",
  })
};
</script>

<style scoped>
.v-card {
  margin: 0;
  position: absolute;
  top: 45%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
}

</style>
