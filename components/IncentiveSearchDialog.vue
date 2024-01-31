<template>
  <vs-dialog
    blur
    :loading="loading"
    v-model="show"
    @close="$emit('closed', false)"
  >
    <template #header>
      <h4 class="not-margin"><b>Search</b> incentives...</h4>
    </template>

    <div class="con-form mt-3">
      <div class="form-group mb-5">
        <vs-input
          block
          label="Username"
          v-model="queryData.username"
        ></vs-input>
      </div>
      <div class="form-group mb-5">
        <vs-input
          block
          label="Date qualified"
          type="date"
          v-model="queryData.qualifiedDate"
        ></vs-input>
      </div>
      <div class="form-group mb-5">
        <vs-input
          block
          label="Issue date"
          type="date"
          v-model="queryData.issueDate"
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
  name: "IncentiveSearchDialog",
  data() {
    return {
      queryData: {
        username: null,
        qualifiedDate: null,
        issueDate: null,
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
    search() {
      this.$emit("search", this.queryData);
      this.$emit("closed", true);
    },
    reset() {
      this.queryData.username = null;
      this.queryData.qualifiedDate = null;
      this.queryData.issueDate = null;
    },
  },
  beforeMount() {
    this.active = this.show;
  },
};
</script>

<style scoped></style>
