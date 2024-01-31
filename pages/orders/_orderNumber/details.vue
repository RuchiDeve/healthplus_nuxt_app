<template>
  <div class="row" v-if="orderData">
    <div class="col-12">
      <div class="row mb-4">
        <div class="col-12 d-flex justify-content-between">
          <div class="d-flex align-items-center justify-content-start">
            <vs-button icon dark circle @click="$router.back()">
              <i class="bx bxs-left-arrow-alt"></i>
            </vs-button>
            <h3 class="display-4">Order Details</h3>
          </div>
          <div class="d-flex align-items-center">
            <vs-button
              success
              square
              @click="confirmOrder"
              v-if="!orderData.confirmed && !$root.authMember"
            >
              <i class="ti-check-box"></i>
              Confirm
            </vs-button>

            <vs-button
              square
              warn
              v-if="!orderData.confirmed"
              @click="
                $router.push('/orders/' + orderData.order_number + '/edit')
              "
            >
              <i class="bx bxs-edit"></i>
              Edit
            </vs-button>

            <vs-button
              square
              danger
              v-if="!orderData.confirmed"
              @click="deleteOrder"
            >
              <i class="mdi mdi-trash-can"></i>
              Delete
            </vs-button>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-7">
          <div class="card">
            <order-details-chart
              :height="170"
              :order-details="orderData"
            ></order-details-chart>

            <div class="border-top py-4 px-4">
              <div class="row">
                <div class="col">
                  <p class="mb-0 text-complete font-weight-semibold">
                    Points Earned
                  </p>
                  <div class="d-flex align-items-end">
                    <h5 class="mb-0 display-4 text-complete">
                      {{ orderData.total_points | number }}
                    </h5>
                    <p class="mb-2 ml-1">CPTs</p>
                  </div>
                </div>
                <div class="col">
                  <p class="mb-0 text-primary font-weight-semibold">
                    Total Cost
                  </p>
                  <div class="d-flex align-items-end">
                    <p class="mb-2 mr-1">
                      {{ orderData.order_currency }}
                    </p>
                    <h5 class="mb-0 display-4 text-primary">
                      {{ orderData.total_cost | number }}
                    </h5>
                  </div>
                </div>
                <div class="col">
                  <p class="mb-0 text-gray text-right font-weight-semibold">
                    Status:
                  </p>
                  <h6 class="mb-0 font-weight-semibold text-right">
                    <span
                      v-if="!orderData.confirmed"
                      class="mdi mdi-18px mdi-triangle text-warning"
                    ></span>
                    <span
                      v-if="orderData.confirmed"
                      class="mdi mdi-18px mdi-check-circle text-success"
                    ></span>

                    <span v-if="!orderData.confirmed" class="text-warning"
                      >Pending</span
                    >
                    <span v-if="orderData.confirmed" class="text-success"
                      >Confirmed</span
                    >
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-5">
          <div class="row">
            <div class="col-lg-12">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Details</h5>
                  <p class="mb-2">
                    <span class="font-weight-bold">Order No:</span>
                    <span class="font-weight-medium">
                      {{ orderData.order_number }}
                    </span>
                  </p>
                  <p class="mb-2" v-if="orderData.member_product_request">
                    <span class="font-weight-bold">Request Pin:</span>
                    <span class="font-weight-medium">
                      {{ orderData.member_product_request.request_pin }}
                    </span>
                  </p>
                  <p class="mb-2">
                    <span class="font-weight-bold">Payment Channel:</span>
                    <span class="font-weight-medium">
                      {{ orderData.payment_channel }}
                    </span>
                  </p>
                  <p class="mb-2">
                    <span class="font-weight-bold">Date of Payment:</span>
                    <span class="font-weight-medium">
                      {{ orderData.paid_at | date }}
                    </span>
                  </p>
                  <p class="mb-2">
                    <span class="font-weight-bold">Country:</span>
                    <span class="font-weight-medium">
                      {{ orderData.domain.country.name }}
                    </span>
                  </p>
                  <p class="mb-2">
                    <span class="font-weight-bold">Date Confirmed:</span>
                    <span
                      class="font-weight-medium"
                      v-show="orderData.confirmed"
                    >
                      {{ orderData.confirmed_at | date }}
                    </span>
                  </p>
                  <p class="mb-2">
                    <span class="font-weight-bold">Confirmed By:</span>
                    <span
                      class="font-weight-medium"
                      v-show="orderData.confirmed"
                    >
                      {{ orderData.confirmed_by_username }}
                    </span>
                  </p>
                </div>
              </div>

              <div class="card card-body mt-2 pb-0">
                <h5 class="card-title">Buyer's Info</h5>
                <div class="d-flex flex-row">
                  <img
                    src="http://placehold.it/50x50"
                    class="img-lg rounded"
                    alt="profile image"
                  />
                  <div class="ml-3">
                    <h6 class="mb-0">
                      {{ orderData.buyer_member.full_name }}
                    </h6>
                    <p class="text-muted mb-0">
                      {{ orderData.buyer_member.user.username }}
                    </p>
                    <p class="text-complete mb-0 semi-bold">
                      {{ orderData.buyer_member.stage.name }}
                    </p>
                    <p>
                      <a
                        target="_blank"
                        class="btn btn-xs btn-primary"
                        v-if="!$root.authMember"
                        :href="
                          '/members/' +
                          orderData.buyer_member.user.username +
                          '/details'
                        "
                      >
                        <i class="bx bx-show"></i>
                        view dashboard
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-12">
          <div class="card card-body">
            <ul
              class="nav nav-tabs tab-basic no-wrap flex-nowrap mb-3"
              role="tablist"
            >
              <li class="nav-item">
                <a
                  class="nav-link active"
                  id="home-tab"
                  data-toggle="tab"
                  href="#order-items"
                  role="tab"
                  aria-controls="order-items"
                  aria-selected="true"
                >
                  Items Purchased
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  id="profile-tab"
                  data-toggle="tab"
                  href="#transactions"
                  role="tab"
                  aria-controls="transactions"
                  aria-selected="false"
                  >Transactions</a
                >
              </li>
            </ul>
            <div class="tab-content tab-content-basic">
              <div
                class="tab-pane fade show active"
                id="order-items"
                role="tabpanel"
                aria-labelledby="home-tab"
              >
                <div class="row">
                  <div class="col-12">
                    <div class="table-responsive table-invoice">
                      <h4 class="card-title mb-0">Items Purchased</h4>
                      <p class="text-muted">See list of items purchased</p>
                      <table class="table table-condensed table-striped">
                        <thead class="">
                          <tr>
                            <th class=""></th>
                            <th class="">Product</th>
                            <th class="text-center">Bottles</th>
                            <th class="text-center">
                              Rate ({{ orderData.order_currency }})
                            </th>
                            <th class="text-center">Points<br />Earned</th>
                            <th class="text-right">
                              Total ({{ orderData.order_currency }})
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(item, index) in orderData.order_items"
                            :key="index"
                          >
                            <td class="">{{ index + 1 }}</td>
                            <td class="">
                              {{ item.product.name }}
                            </td>
                            <td class="text-center">
                              {{ item.number_of_units | number }}
                            </td>
                            <td class="text-center">
                              {{ item.cost_per_unit | currency }}
                            </td>
                            <td class="text-center">
                              {{ item.points_earned | number }}
                            </td>
                            <td class="text-right font-weight-bold">
                              {{ item.total_cost | currency }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="tab-pane fade"
                id="transactions"
                role="tabpanel"
                aria-labelledby="profile-tab"
              >
                <div class="row">
                  <div class="col-12">
                    <div
                      class="mb-3 float-right"
                      v-if="!$root.authMember && orderData.confirmed"
                    >
                      <div class="dropdown show">
                        <a
                          class="btn btn-secondary dropdown-toggle"
                          href="#"
                          role="button"
                          id="dropdownMenuLink"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          Action
                          <i class="mdi mdi-arrow-down-drop-circle"></i>
                        </a>
                        <div
                          class="dropdown-menu"
                          aria-labelledby="dropdownMenuLink"
                        >
                          <!--                          <a class="dropdown-item" href="javascript:void(0);"-->
                          <!--                             @click="rollbackPoints">Rollback Points</a>-->
                          <a
                            class="dropdown-item"
                            href="javascript:void(0)"
                            @click="rollback"
                            >Rollback</a
                          >
                        </div>
                      </div>
                    </div>
                    <transactions-data-list
                      :transactions="orderData.transactions"
                    ></transactions-data-list>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OrderDetailsChart from "@/components/charts/OrderDetailsChart";
import TransactionsDataList from "@/components/TransactionsDataList";
export default {
  name: "OrderDetails",
  components: { TransactionsDataList, OrderDetailsChart },
  layout: "app",
  data() {
    return {
      orderData: null,
    };
  },
  methods: {
    async getOrderDetails() {
      const orderNumber = this.$nuxt.context.params.orderNumber;

      await this.$doTask(async () => {
        let response = await this.$axios.get(
          "orders/" + orderNumber + "/details"
        );

        this.orderData = response.data;
      }, "Connecting...");

      if (this.orderData.processing) {
        this.$vs.notification({
          text: "This Order is still being processed.",
          color: "warn",
        });
      }
    },
    async deleteOrder() {
      if (!confirm("Are you sure?")) return;

      let deleted = false;

      let response = await this.$axios.post(
        "orders/delete/" + this.orderData.id
      );

      deleted = response.data;

      if (deleted) {
        this.$vs.notification({
          text: "Order deleted",
          color: "dark",
          position: "top-center",
        });

        await this.$router.push("/orders");
      } else {
        this.$vs.notification({
          text: "Order NOT deleted",
          color: "warn",
        });
      }
    },
    async confirmOrder() {
      if (!confirm("Are you sure?")) return;

      this.$doTask(async () => {
        let response = await this.$axios.post(
          "orders/confirm/" + this.orderData.order_number
        );

        const confirmed = response.data;

        if (confirmed) {
          this.$vs.notification({
            title: "Order confirmed",
            text: "Order transactions are being processed. Please be patient",
            color: "success",
            position: "top-center",
          });

          this.orderData.confirmed = true;

          // window.location.reload();
        } else {
          this.$vs.notification({
            text: "Order NOT confirmed",
            color: "warn",
          });
        }
      }, "Confirming order...");
    },
    async rollbackPoints() {
      const orderNumber = this.$nuxt.context.params.orderNumber;

      const message =
        "You are about to rollback points for this order. Are you sure you want to continue?";

      if (!confirm(message)) return;

      await this.$doTask(async () => {
        let api = "orders/" + orderNumber + "/rollback/points";
        await this.$axios.get(api);
      });
      window.location.reload();
    },
    async rollbackTransactions() {
      const orderNumber = this.$nuxt.context.params.orderNumber;

      const message =
        "You are about to rollback transactions for this order. Are you sure you want to continue?";

      if (!confirm(message)) return;

      await this.$doTask(async () => {
        let api = "orders/" + orderNumber + "/rollback/transactions";
        await this.$axios.get(api);
      });
      window.location.reload();
    },
    async rollback() {
      const orderNumber = this.$nuxt.context.params.orderNumber;

      const message =
        "You are about to rollback this order. Are you sure you want to continue?";

      if (!confirm(message)) return;

      await this.$doTask(async () => {
        let api = "orders/rollback/" + orderNumber;
        await this.$axios.get(api);
      });
      window.location.reload();
    },
  },
  async mounted() {
    await this.getOrderDetails();
  },
};
</script>

<style scoped></style>
