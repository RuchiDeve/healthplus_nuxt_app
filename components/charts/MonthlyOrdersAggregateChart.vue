<template>

  <div class="card card-body" ref="monthly-orders-chart">
    <h4 class="card-title">Monthly purchase aggregate</h4>
    <bar-chart :height="height"
               :chart-data="chartData"
               :options="chartOptions">
    </bar-chart>

  </div>

</template>

<script>
import BarChart from "@/components/chart-js/BarChart";
export default {
  name: "MonthlyOrdersAggregateChart",
  components: {BarChart},
  data(){
    return {
      chartDataPayload: null,
      chartData: null,
      chartOptions: null,
    }
  },
  props: {
    height: {
      default: 200,
      required: false,
    }
  },
  methods:{
    async fetchChartData(){
      let response = await this.$axios.get("reports/orders/sales-chart-data");
      this.chartDataPayload = response.data;
      this.renderChart();
    },
    getProductsList(){
      const props = _.keys(this.chartDataPayload[0]);

      return _.filter(props, prop => prop !== 'key');
    },
    initProductColours(products){
      const colours = {};

      products.forEach(product => {
        let randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        colours[product] = randomColor;
      });

      return colours;
    },
    renderChart(){
      const products = this.getProductsList();
      const colours = this.initProductColours(products);

      const dataset = [];

      products.forEach(product => {
        dataset.push({
          data: this.getData(this.chartDataPayload, product),
          label: product,
          backgroundColor: colours[product],
          fill: true,
        });
      })

      const chartLabels = this.getLabels(this.chartDataPayload);

      this.chartData = {
        labels: chartLabels,
        datasets: dataset
      };

      this.chartOptions = {
        responsive: true,
      };

    },
    getLabels(chartResponseData){
      return this.getData(chartResponseData, 'key');
    },
    getData(payload, key){
      let data = [];
      payload.forEach((record) => {
        data.push(record[key]);
      });
      return data.reverse();
    }
  },
  mounted() {
    this.$doTask(async () => {
      await this.fetchChartData();
    }, 'Loading chart data...', this.$refs["monthly-orders-chart"])
  }
}
</script>

<style scoped>

</style>
