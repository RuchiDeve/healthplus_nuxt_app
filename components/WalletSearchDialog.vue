<template>
  <vs-dialog
    blur
    :loading="loading"
    v-model="show"
    @close="$emit('closed', false)"
  >
    <template #header>
      <h4 class="not-margin"><b>Search</b> Members' Wallet...</h4>
    </template>

    <div class="con-form mt-3">
      <div class="form-group mb-5">
        <vs-input
          block
          label="Username"
          v-model="queryData.username"
        ></vs-input>
      </div>
    </div>

    <template #footer>
      <div class="footer-dialog">
        <vs-button @click="search" block> Submit </vs-button>
      </div>
    </template>
  </vs-dialog>
</template>

<script>
export default {
  name: "WalletSearchDialog",
  data() {
    return {
      queryData: {
        username: null,
      },
      loading: false,
      active: false,
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    async search() {
      this.loading = true;

      this.$store.commit("members/setPageNumbers", 1);
      this.$store.commit("members/setSearchQueryData", {
        ...this.queryData,
      });
      await this.$store.dispatch("members/fetchMembersWithWallet");

      this.loading = false;
      // this.reset();
      this.active = false;
      this.$emit("closed", this.active);
    },
    reset() {
      this.queryData.username = null;
    },
  },
  beforeMount() {
    this.active = this.show;
  },
};
</script>

<style scoped></style>
