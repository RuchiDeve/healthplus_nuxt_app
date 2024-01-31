<template>
  <div class="container-scroller">
    <div class="container-fluid page-body-wrapper full-page-wrapper">
      <div class="content-wrapper auth p-0 theme-two">
        <div class="row d-flex align-items-stretch">
          <div
            class="col-md-4 banner-section d-none d-md-flex align-items-stretch justify-content-center"
          >
            <div
              class="slide-content bg-1"
              style="background-color: #013baf"
            ></div>
          </div>
          <div class="col-12 col-md-8 h-100 bg-white">
            <div
              class="auto-form-wrapper d-flex align-items-center justify-content-center flex-column"
            >
              <div class="nav-get-started">
                <p>Don't have an account?</p>
                <nuxt-link to="/signup" class="btn get-started-btn">
                  REGISTER
                </nuxt-link>
              </div>
              <div class="login-form">
                <h3 class="mr-auto">
                  DLT Health<span class="font-weight-bold">Plus</span>
                </h3>
                <p class="mb-5 mr-auto">Please sign into your account.</p>
                <div class="form-group">
                  <vs-input block placeholder="Username" v-model="username">
                    <template #icon> @ </template>
                  </vs-input>
                </div>
                <div class="form-group">
                  <vs-input
                    type="password"
                    block
                    v-model="password"
                    placeholder="Password"
                  >
                    <template #icon>
                      <i class="bx bxs-lock"></i>
                    </template>
                  </vs-input>
                </div>
                <div class="form-group">
                  <vs-button
                    block
                    :loading="loading"
                    :active="!loading"
                    v-on:click="login"
                  >
                    Sign In
                  </vs-button>
                </div>
                <div class="wrapper mt-5 text-gray">
                  <p class="footer-text">
                    Copyright © {{ new Date().getFullYear() }}
                    {{ $nuxt.$options.head.title }}. All rights reserved.
                  </p>
                  <ul class="auth-footer text-gray">
                    <li><a href="#">Terms & Conditions </a></li>
                    <li><a href="#">Cookie Policy</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- content-wrapper ends -->
    </div>
    <!-- page-body-wrapper ends -->
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      username: "",
      password: "",
      loading: false,
    };
  },
  methods: {
    async login() {
      await this.$doTask(async () => {
        this.loading = true;

        try {
          await this.$store.dispatch("security/login", {
            username: this.username,
            password: this.password,
          });
        } catch (e) {
          this.$vs.notification({
            title: "Incorrect username/password",
            text: e.response.data.message,
            color: "danger",
            position: "top-center",
          });
        }

        this.loading = false;
      }, "Signing in to your account...");
    },
  },
};
</script>

<style lang="scss" scoped></style>
