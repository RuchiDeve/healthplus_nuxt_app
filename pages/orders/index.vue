<template>
  <div class="row">
    <div class="col-12">
      <div class="row">
        <div class="col-12 d-flex justify-content-between">
          <h3 class="display-4">Orders</h3>
          <vs-button
            size="large"
            active
            success
            square
            @click="$router.push('/orders/new')"
          >
            <i class="mdi mdi-cart-plus"></i>
            Place New Order
          </vs-button>
        </div>
      </div>

      <div class="row">
        <div class="col-12 grid-margin">
          <div class="card bg-transparent">
            <div class="card-body px-0 pb-0">
              <h5 class="font-weight-bold mb-2 card-title">
                Total bottles purchased
              </h5>
              <bottles-sold></bottles-sold>
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-md-8 grid-margin">
          <monthly-orders-aggregate-chart
            :height="200"
          ></monthly-orders-aggregate-chart>
        </div>

        <div class="col-md-4 grid-margin">
          <order-sales-aggregate></order-sales-aggregate>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div
            class="card card-body"
            ref="orders-list"
            style="min-height: 300px"
          >
            <div class="d-flex justify-content-between">
              <div class="d-flex grid-margin" v-if="totalPages">
                <vs-pagination only-arrows v-model="page" />
                <span class="align-self-center badge badge-info">
                  Page: <b>{{ page }}</b>
                </span>
              </div>

              <div>
                <div class="btn-group btn-group-sm">
                  <button
                    class="btn btn-outline-primary"
                    @click="showSearchDialog = !showSearchDialog"
                  >
                    <i class="mdi mdi-account-search"></i>
                    Search...
                  </button>
                  <button
                    v-show="searchPayload !== null"
                    class="btn btn-danger"
                    @click="resetSearch"
                  >
                    <i class="bx bxs-x-square"></i>
                  </button>
                  <order-search-dialog
                    :show="showSearchDialog"
                    @closed="showSearchDialog = false"
                    @search="searchOrder($event)"
                  ></order-search-dialog>
                </div>
              </div>
            </div>

            <orders-list
              :orders="orders"
              :show-payer="true"
              :show-buyer="true"
            ></orders-list>
          </div>
        </div>
        <div class="col-12 mt-4" v-if="totalPages">
          <vs-pagination v-model="page" :length="totalPages" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BottlesSold from "@/components/BottlesSold";
import MonthlyOrdersAggregateChart from "@/components/charts/MonthlyOrdersAggregateChart";
import OrderSalesAggregate from "@/components/OrderSalesAggregate";
import OrdersList from "@/components/OrdersList";
import OrderSearchDialog from "@/components/OrderSearchDialog";
export default {
  components: {
    OrderSearchDialog,
    OrdersList,
    OrderSalesAggregate,
    MonthlyOrdersAggregateChart,
    BottlesSold,
  },
  layout: "app",
  name: "index",
  data() {
    return {
      orders: [],
      pagination: null,
      page: 1,
      totalPages: null,
      showSearchDialog: false,
      searchPayload: null,
    };
  },
  methods: {
    async loadOrders() {
      await this.$doTask(
        async () => {
          let response = await this.$axios.$get("orders", {
            params: {
              page: this.page,
              ...this.searchPayload,
            },
          });

          this.orders = response.data;
          // this.pagination = response.data.pagination;
          this.totalPages = response.last_page;
        },
        "Loading orders...",
        this.$refs["orders-list"]
      );
    },
    searchOrder(payload) {
      this.searchPayload = payload;
      this.loadOrders();
    },
    resetSearch() {
      this.searchPayload = null;
      this.loadOrders();
    },
  },
  mounted() {
    this.loadOrders();
  },
  watch: {
    page(_, __) {
      this.loadOrders();
    },
  },
};
</script>

<style scoped></style>
