<template>
  <div class="card card-body" ref="product-bank">
    <h4 class="card-title">
      Product Bank
    </h4>
    <div class="pt-0 table-responsive" v-if="productBankList.data.length">
      <table class="table table-hover table-condensed" style="table-layout: initial">
        <thead class="thead-light">
        <tr>
          <th>Product</th>
          <th>Qty (bottles)</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(bank, index) in productBankList.data" :key="index">
          <td>{{bank.product.name}}</td>
          <td>{{bank.bottles | number}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else style="height: 200px;" class="d-flex flex-column justify-content-center align-items-center">
      <h6 class="text-muted">Inventory is empty</h6>
    </div>
  </div>
</template>

<script>
export default {
  name: "stockist-product-bank-list",
  data() {
    return {
      assignedBranches: [],
      products: [],
      productBankList: {
        data: [],
        branch_id: -1,
      },
    }
  },
  props: {
    stockist: {
      required: true,
      type: Object,
    }
  },
  methods: {
    async fetchProductBank(){
      await this.$doTask(async ()=>{
        const id = this.stockist.id;
        this.productBankList.data = await this.$axios.$get('/inventory/stockist/' + id + '/bank');
      }, 'Please wait......', this.$refs['product-bank']);


    },
  },
  mounted() {
    this.fetchProductBank();
  }
}
</script>

<style scoped>

</style>
