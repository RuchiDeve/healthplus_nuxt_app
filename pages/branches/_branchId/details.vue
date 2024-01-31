<template>
  <div class="row" ref="branches-list" v-if="branch">
    <div class="col-12">
      <div class="row mb-3">
        <div class="col-12 d-flex justify-content-start">
          <vs-button icon dark circle @click="$router.back()">
            <i class="bx bxs-left-arrow-alt"></i>
          </vs-button>
          <h3 class="display-4">Branch Details ({{ branch.name }})</h3>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-lg-3">
          <div class="card card-body">
            <h5 class="card-title">Contact / Account</h5>
            <div class="d-flex flex-row">
              <div class="">
                <h6 class="mb-2">
                  <div class="small text-muted">Address:</div>
                  {{ branch.address }}
                </h6>
                <h6 class="">
                  <div class="small text-muted">Bank:</div>
                  {{ branch.bank }}
                </h6>
                <h6 class="">
                  <div class="small text-muted">Account Number:</div>
                  {{ branch.account_number }}
                </h6>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-3">
          <div class="card card-body">
            <h5 class="card-title">Branch Admin</h5>
            <div class="d-flex flex-row">
              <div class="">
                <h6 class="mb-2">
                  <div class="small text-muted">Name:</div>
                  {{ branch.staff_admin.full_name }}
                </h6>
                <h6 class="">
                  <div class="small text-muted">Phone:</div>
                  {{ branch.staff_admin.phone || "nil" }}
                </h6>

                <h6 class="">
                  <div class="small text-muted">Username:</div>
                  {{ branch.staff_admin.user.username }}
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-12 d-flex justify-content-between">
          <h5 class="display-4">
            <i class="bx bxs-bank"></i>
            Product Bank
          </h5>
        </div>
        <div class="col-8">
          <div class="pt-0 table-responsive">
            <table
              class="table table-hover table-condensed"
              style="table-layout: initial"
            >
              <thead class="thead-light">
                <tr>
                  <th>Product</th>
                  <th>Qty (bottles)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product, index) in branch.products" :key="index">
                  <td>{{ product.product.name }}</td>
                  <td>{{ product.bottles | number }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "details",
  layout: "app",
  data() {
    return {
      branch: null,
    };
  },
  methods: {
    async getBranchDetails() {
      const loading = this.$vs.loading({
        text: "Please wait...",
      });

      try {
        const branchId = this.$nuxt.context.params.branchId;

        this.branch = await this.$axios.$get(`/branches/${branchId}/details/`);
      } catch (e) {
        console.log("error placing request", e.response);
      } finally {
        loading.close();
      }
    },
  },
  mounted() {
    this.getBranchDetails();
  },
};
</script>

<style scoped></style>
