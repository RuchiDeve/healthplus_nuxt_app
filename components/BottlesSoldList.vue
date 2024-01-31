<template>

  <div class="card" ref="bottles-purchased" >
    <div class="card-body">
      <h5 class="card-title">Products Purchased</h5>

      <div style="overflow-x: auto; height: 350px;">
        <div class="d-flex align-items-center pb-1 pt-1 border-bottom"
             v-for="(product, prop) in products" :key="prop">
          <vs-avatar square size="50">
            <img :src="product.image" alt="">
          </vs-avatar>
          <div class="wrapper w-100 pl-2">
            <div class="d-flex align-items-center justify-content-between">
              <span class="font-weight-bold">{{product.name}}</span>
              <span class="text-gray font-weight-medium text-small">{{product.order_items_count | number}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "BottlesSoldList",
  data(){
    return {
      products: []
    }
  },
  methods: {
    async getStats(){
      await this.$doTask(async ()=> {
        let response = await this.$axios.get('reports/orders/products-sold');
        this.products = response.data;
      }, 'Calculating...', this.$refs["bottles-purchased"])
    }
  },
  mounted() {
    this.getStats();
  }
}
</script>

<style scoped>

</style>
