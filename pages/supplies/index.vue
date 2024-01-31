<template>
  <div class="row">
    <div class="col-12">
      <div class="row mt-2 mb-3">
        <div class="col-12 d-flex justify-content-between">
          <h3 class="display-4">Manage Supplies</h3>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card card-body" ref="supplies-list" style="min-height: 300px">
            <div class="d-flex grid-margin" v-if="totalPages">
              <vs-pagination only-arrows v-model="page" :length="totalPages" />
              <span class="align-self-center badge badge-info">
                    Page: <b>{{ page }}</b>
                  </span>
            </div>
            <div class="table-responsive">
              <table class="table table-condensed table-hover">
                <thead>
                <tr>
                  <th></th>
                  <th>Date</th>
                  <th>Supplier</th>
                  <th>Amount</th>
                  <th>Products</th>
                  <th>Status</th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(supply, index) in supplies" :key="supply.id">
                  <td>{{index + 1}}</td>
                  <td>{{supply.createdAt | date}}</td>
                  <td>{{supply.supplier.fullName}}</td>
                  <td>{{supply.totalCommission | number}}</td>
                  <td>{{supply.supplyItems.length}}</td>
                  <td>
                    <span class="badge badge-success" v-if="supply.confirmed">
                      <i class="bx bxs-check-circle"></i>
                      CONFIRMED, PAID
                    </span>
                    <span class="badge badge-warning" v-else>
                      <i class="bx bxs-error"></i>
                      PENDING
                    </span>
                  </td>
                  <td>
                    <vs-button flat primary square size="small"
                               @click="viewSupplyDetails(supply)">
                      <i class="bx bxs-detail"></i>
                      details
                    </vs-button>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="col-12 mt-4" v-if="totalPages">
          <vs-pagination v-model="page" :length="totalPages" />
        </div>
      </div>
    </div>
    <vs-dialog v-model="supplyDetailsModal.show"
               @close="supplyDetailsModal.show = false">
      <template #header>
        <h4 class="">Supply Details</h4>
      </template>

      <div class="mt-3 table-responsive" style="max-height: 300px; overflow-y: auto">
        <table class="table table-condensed" v-if="supplyDetailsModal.data">
          <thead>
          <tr>
            <th></th>
            <th>Product</th>
            <th>Quantity</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in supplyDetailsModal.data.supplyItems" :key="index">
            <td>{{index + 1}}</td>
            <td>{{item.supplierProduct.product.name}}</td>
            <td>{{item.quantity | number}}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <template #footer>
        <div class="d-flex justify-content-between" v-if="supplyDetailsModal.data">
          <vs-button flat
                     :warn="supplyDetailsModal.data.confirmed"
                     :success="!supplyDetailsModal.data.confirmed"
                     square @click="toggleConfirmation">
            {{supplyDetailsModal.data.confirmed ? 'Un-confirm' : 'Confirm'}}
          </vs-button>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>

<script>
export default {
  name: "index.vue",
  layout: "app",
  data(){
    return {
      supplies: [],
      totalPages: 1,
      pagination: null,
      page: 1,
      supplyDetailsModal: {
        show: false,
        data: null
      }
    }
  },
  methods: {
    viewSupplyDetails(supply){
      this.supplyDetailsModal.data = supply;
      this.supplyDetailsModal.show = true;
    },
    async getSupplies(){
      await this.$doTask(async () => {
        let response = await this.$axios.get('supply/list');
        this.supplies = response.data.content;
        this.pagination = response.data.pagination;
        this.totalPages = response.data.totalPages;
      }, 'Loading...');
    },
    async toggleConfirmation(){
      const supply = this.supplyDetailsModal.data;

      await this.$doTask(async () => {
        await this.$axios.post('supply/' + supply.id + '/confirm/toggle');
      });

      supply.confirmed = !supply.confirmed;
      this.supplyDetailsModal.show = false;
    }
  },
  mounted() {
    this.getSupplies();
  }
}
</script>

<style scoped>

</style>
