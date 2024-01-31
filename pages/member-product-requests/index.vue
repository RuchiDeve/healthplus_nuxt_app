<template>
  <div class="row">
    <div class="col-12">
      <div class="d-flex justify-content-between mt-5 mb-3">
        <h4 class="display-4">Member Product Requests</h4>
        <div>
          <vs-input icon-after block type="search" v-model="search" @input="getMemberProductRequests">
            <template #icon>
              <i class='bx bx-search-alt'></i>
            </template>
          </vs-input>
          <vs-dialog
            blur
            :loading="resourceModal.loading"
            v-model="resourceModal.show"
            @close="resourceModal.show = false"
          >
            <template #header>
              <h4 class="not-margin">
                View Order Items
              </h4>
            </template>

            <div class="mt-3 table-responsive">
              <table class="table table-hover table-condensed table-hover">
                <thead>
                  <th>#</th>
                  <th>Product</th>
                  <th>Quantity</th>
                </thead>
                <tbody>
                  <tr v-for="(orderItem, orderItemIndex) in orderItems" :key="orderItemIndex">
                    <td>
                      {{ orderItemIndex + 1 }}
                    </td>
                    <td>
                      {{orderItem.product.name}}
                    </td>
                    <td>
                      {{orderItem.number_of_units}}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </vs-dialog>
        </div>
      </div>
      <div class="table-responsive card card-body">
        <table class="table table-hover table-condensed table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Pin</th>
              <th>Products Quantity</th>
              <th>Issued</th>
              <th>Date Issued</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in memberProductRequests"
              :key="index"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ item.member.user.username }}</td>
              <td>{{ item.request_pin }}</td>
              <td>{{ item.order.total_product_bottles }}</td>
              <td :class="item.issued ? 'text-success' : 'text-warning'">
                {{ item.issued ? 'Issued' : 'Pending' }}
              </td>
              <td v-if="item.issued_at === null">NA</td>
              <td v-else>{{ item.issued_at | date }}</td>
              <td>
                <div class="d-flex">
                  <vs-button
                    @click="viewOrderItems(item.order)"
                    size="small"
                    title="View Order Items"
                  >
                    <i class="bx bx-show-alt"></i>
                  </vs-button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="pt-4" v-if="totalPages">
          <vs-pagination
            v-model="page"
            :length="totalPages"
            @input="getMemberProductRequests"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Helpers from "@/utils/helpers";
import { Permissions } from "@/utils/permissions";
import _ from "lodash";

export default {
  name: "MemberProductRequests",
  layout: "app",
  middleware() {
    Helpers.authorize(Permissions.All);
  },
  data() {
    return {
      memberProductRequests: [],
      resourceModal: {
        show: false,
        loading: false,
      },
      orderItems: [],
      search: "",
      page: 1,
      totalPages: 1,
    };
  },
  async fetch() {
    await this.getMemberProductRequests();
  },
  methods: {
    getMemberProductRequests: _.debounce(async function () {
      await this.$doTask(async () => {
        let params = {
          page: this.page,
          "filter[search]": this.search,
        };
        const response =
          await this.$repositories.memberProductRequests.index(params);
        this.memberProductRequests = response.data;
        this.totalPages = response.last_page;
      }, "Loading...");
    }, 500),
    viewOrderItems(order) {
      this.orderItems = order.order_items;
      this.resourceModal.show = true;
    }
  },
};
</script>

<style scoped></style>
