<script>

import {Line, mixins} from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
  extends: Line,
  props: {
    chartData: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },
  mixins: [reactiveProp],
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
}
</script>

<style scoped>

</style>
