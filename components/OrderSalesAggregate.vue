<template>
  <div
    class="card"
    style="overflow-y: auto"
    :style="{ height: height + 'px' }"
    ref="order-sales-stats"
  >
    <div
      class="card-body d-flex flex-column justify-content-between"
      v-if="stats"
    >
      <div class="row">
        <div class="col-md-12">
          <div class="d-flex align-items-end">
            <h1 class="display-4 font-weight-semibold mb-0">
              {{ stats.daily | number }}
            </h1>
            <h5 class="ml-3 mb-2">Daily</h5>
          </div>
          <p class="mt-0 mb-2">Total CPTs purchased Today</p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="d-flex align-items-end">
            <h1 class="display-4 font-weight-semibold mb-0">
              {{ stats.weekly | number }}
            </h1>
            <h5 class="ml-3 mb-2">Weekly</h5>
          </div>
          <p class="mt-0 mb-2">Total CPTs purchased in the last 7 days</p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="d-flex align-items-end">
            <h1 class="display-4 font-weight-semibold mb-0">
              {{ stats.monthly | number }}
            </h1>
            <h5 class="ml-3 mb-2">Monthly</h5>
          </div>
          <p class="mt-0 mb-2">Total CPTs purchased this month</p>
        </div>
      </div>
      <!-- <div class="row">
        <div class="col-md-12">
          <div class="d-flex align-items-end">
            <h1 class="display-4 font-weight-semibold mb-0">
              {{ stats.yearly | number }}
            </h1>
            <h5 class="ml-3 mb-2">Yearly</h5>
          </div>
          <p class="mt-0 mb-2">Total CPTs purchased this year</p>
          <select
            class="form-control"
            name="year"
            @change="updateYear($event)"
            v-model="year"
          >
            <option value="">Select Year</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
          </select>
        </div>
      </div> -->
      <div class="row">
        <div class="col-md-12">
          <hr />
          <form>
            <div class="form-row">
              <div class="form-group col-12">
                <label for="from">Start Date</label>
                <input
                  v-model="from"
                  type="date"
                  class="form-control"
                  placeholder="From"
                  @input="getAggregateOrders"
                />
              </div>
              <div class="form-group col-12">
                <label for="to">End Date</label>
                <input
                  v-model="to"
                  type="date"
                  class="form-control"
                  placeholder="To"
                  @input="getAggregateOrders"
                />
              </div>
            </div>
          </form>
        </div>
        <div class="col-md-12" ref="aggregate-orders">
          <template v-if="aggregateOrders !== null">
            <div class="col-md-12">
              <div class="d-flex align-items-end">
                <h1 class="display-4 font-weight-semibold mb-0">
                  {{ aggregateOrders.total_orders | number }}
                </h1>
                <h5 class="ml-3 mb-2">Total Orders</h5>
              </div>
            </div>
            <div class="col-md-12">
              <div class="d-flex align-items-end">
                <h1 class="display-4 font-weight-semibold mb-0">
                  {{ aggregateOrders.total_points | number }}
                </h1>
                <h5 class="ml-3 mb-2">Total Points</h5>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderSalesAggregate",
  data() {
    return {
      stats: null,
      year: null,
      from: "",
      to: "",
      aggregateOrders: null,
    };
  },
  props: {
    height: {
      default: 427,
      required: false,
      type: Number,
    },
  },
  computed: {
    currentDate() {
      // Current date in milliseconds
      // Subtract timezone offset to take of
      // timezone disparity.
      return Date.now() - new Date().getTimezoneOffset() * 60000;
    },
    today() {
      return new Date(this.currentDate).toISOString().substring(0, 10);
    },
    tomorrow() {
      return new Date(this.currentDate + 86400000)
        .toISOString()
        .substring(0, 10);
    },
  },
  methods: {
    async fetchStats() {
      await this.$doTask(
        async () => {
          let response = await this.$axios.get("reports/orders/sales-info");
          this.stats = response.data;
          console.log("stats", response.data);
        },
        undefined,
        this.$refs["order-sales-stats"]
      );
    },
    setup() {
      console.log(this);
      this.from = this.today;
      this.to = this.tomorrow;

      this.getAggregateOrders();
    },
    async getAggregateOrders() {
      let params = {
        "filter[from]": this.from,
        "filter[to]": this.to,
      };
      let queryParams = new URLSearchParams(params).toString();
      await this.$doTask(
        async () => {
          let response = await this.$axios.get(
            `aggregate-orders?${queryParams}`
          );
          this.aggregateOrders = response.data;
          // console.log("stats", response.data);
        },
        undefined,
        this.$refs["aggregate-orders"]
      );
    },
    setup() {
      this.from = this.today;
      this.to = this.tomorrow;
      this.getAggregateOrders();
    },
    async getAggregateOrders() {
      let params = {
        "filter[from]": this.from,
        "filter[to]": this.to,
      };
      let queryParams = new URLSearchParams(params).toString();
      await this.$doTask(
        async () => {
          let response = await this.$axios.get(
            `aggregate-orders?${queryParams}`
          );
          this.aggregateOrders = response.data;
          // console.log("stats", response.data);
        },
        undefined,
        this.$refs["aggregate-orders"]
      );
    },
  },
  mounted() {
    this.fetchStats();
    this.setup();
  },
};
</script>

<style scoped></style>
