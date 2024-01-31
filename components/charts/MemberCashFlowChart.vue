<template>

  <div class="card card-body" ref="member-chart">
    <h5 class="card-title">Cash flow (Credits / Debits)</h5>
    <line-chart :height="height"
      :chart-data="chartData"
                :options="chartOptions"
      ></line-chart>

  </div>

</template>

<script>
import LineChart from "~/components/chart-js/LineChart";
export default {
  name: "MemberCashFlowChart",
  components: {LineChart},
  data: () => ({
    chartData: null,
    chartOptions: null
  }),
  props: {
    height: {
      default: 200,
      required: false,
    }
  },
  methods: {
    async initChart(){
      const username = this.$store.state.members.memberDetails.user.username;

      const response = await this.$axios.get(`/reports/members/${username}/chart-data`);

      const chartResponseData = response.data;

      this.chartData = {
        labels: this.getLabels(chartResponseData),
        datasets: [
          {
            label: 'Credits',
            data: this.getCredits(chartResponseData),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          },
          {
            label: 'Debits',
            data: this.getDebits(chartResponseData),
            fill: false,
            borderColor: 'rgb(192,75,75)',
            tension: 0.1
          }
        ]
      };
      this.chartOptions = {
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      };
    },
    getLabels(chartResponseData){
      return this.getData(chartResponseData, 'key');
    },
    getCredits(chartResponseData){
      return this.getData(chartResponseData, 'credits');
    },
    getDebits(chartResponseData){
      return this.getData(chartResponseData, 'debits');
    },
    getData(payload, key){
      let data = [];
      payload.forEach((record) => {
        data.push(record[key]);
      });
      return data.reverse();
    }
  },
  async mounted () {
    await this.$doTask(async () => {
      await this.initChart();
    }, 'Loading chart data...', this.$refs["member-chart"])

  }
}
</script>

<style lang="scss" scoped>


</style>
