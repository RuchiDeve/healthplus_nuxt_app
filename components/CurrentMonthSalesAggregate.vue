<template>

  <div class="card card-body" ref="current-month-orders-chart">
    <h4 class="card-title">{{getCurrentMonth()}}'s sales</h4>
    <bar-chart :height="height"
               :chart-data="chartData"
               :options="chartOptions">
    </bar-chart>

  </div>

</template>

<script>
import BarChart from "@/components/chart-js/BarChart";
import Helpers from "@/utils/helpers";

export default {
  name: "CurrentMonthSalesAggregate",
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
      this.chartDataPayload = [response.data[0]];
      this.renderChart();
    },
    getProductsList(){
      const props = _.keys(this.chartDataPayload[0]);

      return _.filter(props, prop => prop !== 'key');
    },
    initProductColours(products){
      const colours = {};

      products.forEach(product => {
        colours[product] = '#' + Math.floor(Math.random() * 16777215).toString(16);
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

      console.log('dataset', dataset);

      this.chartData = {
        labels: chartLabels,
        datasets: dataset
      };

      this.chartOptions = {
        responsive: true,
        legend: {
          position: 'bottom'
        }
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
    },
    getCurrentMonth(){
      return Helpers.getCurrentMonth();
    }
  },
  mounted() {
    this.$doTask(async () => {
      await this.fetchChartData();
    }, 'Loading chart data...', this.$refs["current-month-orders-chart"])
  }
}
</script>

<style scoped>

</style>
