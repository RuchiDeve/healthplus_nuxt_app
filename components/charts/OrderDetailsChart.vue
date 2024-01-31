<template>

  <div class="card card-body" ref="member-chart">
    <h5 class="card-title">Order details summary</h5>
    <pie-chart :height="height"
               :chart-data="chartData"
               :options="chartOptions"></pie-chart>

  </div>

</template>

<script>
import PieChart from "@/components/chart-js/PieChart";
export default {
  name: "OrderDetailsChart",
  components: {PieChart},
  data: () => ({
    chartData: null,
    chartOptions: null
  }),
  props: {
    height: {
      default: 200,
      required: false,
      type: Number
    },
    orderDetails: {
      required: true,
      type: Object
    }
  },
  methods:{
    getPointsReceived(){
      return _.map(this.orderDetails.order_items, 'points_earned');
    },
    getProductsPurchased(){
      let products = _.map(this.orderDetails.order_items, 'product');
      return _.map(products, 'name');
    },
    initChart(){
      const colours = [];

      for (let i = 0; i < this.orderDetails.order_items.length; i++) {
        let randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        colours.push(randomColor);
      }

      this.chartData = {
        labels: this.getProductsPurchased(),
        datasets: [
          {
            data: this.getPointsReceived(),
            backgroundColor: colours
          }
        ]
      };
      this.chartOptions = {
        responsive: true,
      };
    }
  },
  mounted() {
    this.initChart();

  }
}
</script>

<style scoped>

</style>
