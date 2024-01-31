<template>
  <div class="row">
    <div class="col-12">
      <div class="row mb-3 mt-2">
        <div class="col-12">
          <h2 class="display-3">Dashboard</h2>
        </div>
      </div>

      <div style="overflow-x: auto; min-height: 150px" ref="dashboard-stat">
        <div class="d-flex flex-nowrap row" v-if="dashboard">
          <div class="col border-left">
            <div class="card" style="min-width: 230px">
              <div class="card-body">
                <div class="d-flex flex-column">
                  <p
                    class="card-text font-weight-bold mb-0"
                    style="white-space: nowrap"
                  >
                    Inactive Members
                  </p>
                  <div class="fluid-container">
                    <h3 class="card-title text-danger mb-0">
                      {{ dashboard.total_inactive | number }}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col border-left">
            <div class="card" style="min-width: 230px">
              <div class="card-body">
                <div class="d-flex flex-column">
                  <p
                    class="card-text font-weight-bold mb-0"
                    style="white-space: nowrap"
                  >
                    Active Members
                  </p>
                  <div class="fluid-container">
                    <h3 class="card-title text-success mb-0">
                      {{ dashboard.total_active | number }}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col border-left">
            <div class="card" style="min-width: 230px">
              <div class="card-body">
                <div class="d-flex flex-column">
                  <p
                    class="card-text font-weight-bold mb-0"
                    style="white-space: nowrap"
                  >
                    Stockists
                  </p>
                  <div class="fluid-container">
                    <h3 class="card-title text-info mb-0">
                      {{ dashboard.total_stockists | number }}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col border-left">
            <div class="card" style="min-width: 230px">
              <div class="card-body">
                <div class="d-flex flex-column">
                  <p
                    class="card-text font-weight-bold mb-0"
                    style="white-space: nowrap"
                  >
                    Pending Orders
                  </p>
                  <div class="fluid-container">
                    <h3 class="card-title text-warning mb-0">
                      {{ dashboard.total_pending_orders | number }}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col border-left">
            <div class="card" style="min-width: 230px">
              <div class="card-body">
                <div class="d-flex flex-column">
                  <p
                    class="card-text font-weight-bold mb-0"
                    style="white-space: nowrap"
                  >
                    Pending Deposits
                  </p>
                  <div class="fluid-container">
                    <h3 class="card-title text-warning mb-0">
                      {{ dashboard.totalPendingDeposits | number }}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-12">
          <members-info></members-info>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-md-4">
          <bottles-sold-list></bottles-sold-list>
        </div>
        <div class="col-md-4">
          <current-month-sales-aggregate
            :height="475"
          ></current-month-sales-aggregate>
        </div>
        <div class="col-md-4">
          <order-sales-aggregate :height="458"></order-sales-aggregate>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-md-6">
          <order-confirmations-data-statistics></order-confirmations-data-statistics>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MembersInfo from "@/components/dashboard/MembersInfo";
import CurrentMonthSalesAggregate from "@/components/CurrentMonthSalesAggregate";
import OrderSalesAggregate from "@/components/OrderSalesAggregate";
import BottlesSoldList from "@/components/BottlesSoldList";
import OrderConfirmationsDataStatistics from "@/components/OrderConfirmationsDataStatistics";

export default {
  name: "StaffDashboard",
  components: {
    OrderConfirmationsDataStatistics,
    MembersInfo,
    CurrentMonthSalesAggregate,
    OrderSalesAggregate,
    BottlesSoldList,
  },
  data() {
    return {
      dashboard: null,
    };
  },
  methods: {
    async getDashboardStatistics() {
      await this.$doTask(
        async () => {
          let response = await this.$axios.get("reports/dashboard/statistics");
          this.dashboard = response.data;
        },
        "Loading...",
        this.$refs["dashboard-stats"]
      );
    },
  },
  mounted() {
    this.getDashboardStatistics();
  },
};
</script>

<style scoped></style>
