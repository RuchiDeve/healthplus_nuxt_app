<template>

  <div class="d-flex flex-nowrap row" style="overflow-x: auto; min-height: 150px;" ref="bottles-sold-stat">
    <div class="col border-left" v-for="(product, prop) in products" :key="prop">
      <div class="card" style="min-width: 230px;">
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-center">
            <div class="mr-3">
              <vs-avatar square size="60">
                <img :src="product.image" alt="">
              </vs-avatar>
            </div>
            <div class="wrapper">
              <p class="card-text mb-0" style="white-space: nowrap">{{product.name}}</p>
              <div class="fluid-container">
                <h3 class="card-title mb-0">{{product.order_items_count | number}}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "BottlesSold",
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
      }, 'Calculating...', this.$refs["bottles-sold-stat"])
    }
  },
  mounted() {
    this.getStats();
  }
}
</script>

<style scoped>

</style>
