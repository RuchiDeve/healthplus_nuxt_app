<template>
  <div class="row" ref="requests-list">
    <div class="col-12">
      <div class="row mb-3">
        <div class="col-12 d-flex justify-content-between">
          <h3 class="display-4">Product Requests</h3>
          <vs-button
            active
            success
            square
            flat
            :href="'/inventory/stockist/requests/new'"
          >
            <i class="mdi mdi-plus"></i>
            Request For Product
          </vs-button>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card">
            <div
              class="card-body d-flex justify-content-between align-items-center"
            >
              <div class="d-flex align-self-center" v-if="requests.totalPages">
                <vs-pagination
                  only-arrows
                  v-model="requests.page"
                  :length="requests.totalPages"
                />
                <span class="align-self-center badge badge-info">
                  Page: <b>{{ requests.page }}</b> of {{ requests.totalPages }}
                </span>
              </div>

              <div class="">
                <vs-input
                  icon-after
                  block
                  placeholder="Search"
                  type="search"
                  v-model="searchString"
                  @input="getProductRequests"
                >
                  <template #icon>
                    <i class="bx bx-search"></i>
                  </template>
                </vs-input>
                <!-- <button class="btn btn-sm btn-outline-primary"
                        @click="showSearchDialog = !showSearchDialog"
                        data-toggle="modal" data-target="#searchModal">
                  <i class="mdi mdi-account-search"></i>
                  Search...
                </button> -->
              </div>

              <!-- <vs-button
                danger
                class="align-self-center"
                v-show="shouldResetSearchDialog"
                circle
                size="small"
                icon
              >
                <i class="bx bxs-x-square"></i>
              </vs-button> -->
            </div>

            <div class="table-responsive">
              <table
                class="table table-hover table-condensed"
                style="table-layout: initial"
              >
                <thead class="">
                  <tr>
                    <th style="width: 5px"></th>
                    <th>Request PIN</th>
                    <th>Total Products</th>
                    <th>Issued</th>
                    <th>Received</th>
                    <th style="width: 40px"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    style="cursor: pointer"
                    :key="index"
                    :class="{ 'text-warning': !request.received }"
                    v-for="(request, index) in requests.data"
                  >
                    <td>{{ index + 1 }}</td>
                    <td>{{ request.request_pin }}</td>
                    <td>
                      {{ request.items.length }}
                    </td>
                    <td>
                      <div v-if="!!request.issued_by">
                        by:
                        <span class="font-weight-semibold">{{
                          request.issued_by_user.username
                        }}</span>
                        <br />
                        <small class="">({{ request.issued_at | date }})</small>
                      </div>
                    </td>
                    <td>
                      <div v-if="request.received">
                        <span class="font-weight-semibold">
                          <i class="mdi mdi-check"></i>
                        </span>
                        <br />
                        <span class="">({{ request.received_at | date }})</span>
                      </div>
                    </td>
                    <td>
                      <div class="dropdown show">
                        <a
                          class="btn btn-inverse-dark btn-xs dropdown-toggle"
                          href="javascript:void(0)"
                          role="button"
                          id="dropdownMenuLink"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          Action
                          <i class="bx bx-dots-vertical-rounded"></i>
                        </a>
                        <div
                          class="dropdown-menu"
                          aria-labelledby="dropdownMenuLink"
                        >
                          <a
                            class="dropdown-item"
                            href="javascript:void(0)"
                            @click="initShowProductsModal(request)"
                          >
                            <i class="bx bxs-shopping-bags"></i>
                            Show products
                          </a>
                          <a
                            class="dropdown-item"
                            href="javascript:void(0)"
                            v-if="!$root.authMember"
                            @click="issueRequest(request)"
                          >
                            <i class="bx bxs-check-circle"></i>
                            Issue Request
                          </a>

                          <br />

                          <a
                            class="dropdown-item"
                            href="javascript:void(0)"
                            @click="removeRequest(request)"
                          >
                            <i class="bx bx-edit"></i>
                            delete
                          </a>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="col-12 mt-4" v-if="requests.totalPages">
          <vs-pagination
            v-model="requests.page"
            :length="requests.totalPages"
          />
        </div>
      </div>
    </div>

    <vs-dialog
      blur
      v-model="requestProductModal.show"
      @close="requestProductModal.show = false"
    >
      <template #header>
        <h4 class="not-margin" v-if="requestProductModal.selectedRequest">
          <b>Items Requested</b>
        </h4>
      </template>

      <div class="row" v-if="requestProductModal.selectedRequest">
        <div class="col-12">
          <div
            class="pt-0 table-responsive"
            v-if="requestProductModal.selectedRequest.items.length"
          >
            <table
              class="table table-hover table-condensed"
              style="table-layout: initial"
            >
              <thead class="thead-light">
                <tr>
                  <th>Product</th>
                  <th>Qty (bottles)</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(cartItem, index) in requestProductModal
                    .selectedRequest.items"
                  :key="index"
                >
                  <td>{{ cartItem.product.name }}</td>
                  <td>{{ cartItem.bottles | number }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </vs-dialog>
  </div>
</template>

<script>
import { Permissions } from "~/utils/permissions";
import _ from 'lodash';

export default {
  name: "index",
  layout: "app",
  data() {
    return {
      shouldRefresh: false,
      showSearchDialog: false,
      searchString: '',
      requests: {
        page: 1,
        pagination: null,
        totalPages: 1,
        data: [],
      },
      search: {
        username: null,
        name: null,
        stage: null,
        pin: null
      },
      requestProductModal: {
        show: false,
        selectedRequest: null,
      },
    };
  },
  methods: {
    initShowProductsModal(request) {
      this.requestProductModal.selectedRequest = request;
      this.requestProductModal.show = true;
    },
    async issueRequest(request) {
      if (!confirm("Are you sure?")) return;

      await this.$doTask(
        async () => {
          let response = await this.$axios.$post(
            "inventory/stockist/request/issue",
            {
              request_id: request.id,
            }
          );

          window.location.reload();
        },
        "Issuing request",
        this.$refs["requests-list"]
      );

      this.shouldRefresh = true;
    },
    async receiveRequest(request) {
      if (!confirm("Are you sure?")) return;

      await this.$doTask(
        async () => {
          let response = await this.$axios.$post(
            "inventory/stockist/request/receive",
            {
              request_id: request.id,
            }
          );

          window.location.reload();
        },
        "Receiving request",
        this.$refs["requests-list"]
      );

      this.shouldRefresh = true;
    },
    setSearch(){
      this.search = {
        username: this.searchString,
        name: this.searchString,
        stage: this.searchString,
        pin: this.searchString,
      }
    },
    getProductRequests: _.debounce(async function () {
      await this.$doTask(
        async () => {
          this.setSearch()
          let response = await this.$axios.$get("inventory/stockist/requests", {
            params: {
              page: this.requests.page,
              ...this.search,
            },
          });

          // console.log('response',response.data)

          this.requests.data = response.data;
          this.requests.totalPages = response.last_page;
        },
        "Fetching product requests...",
        this.$refs["requests-list"]
      );
    }, 500),
  },
  computed: {
    searchData() {
      return this.search;
    },
    permissions() {
      return Permissions;
    },
    shouldResetSearchDialog() {
      var reset = false;

      for (const [key, value] of Object.entries(this.searchData)) {
        reset = !(value == null || value === "");

        if (reset) break;
      }

      return reset;
    },
  },
  mounted() {
    this.getProductRequests();
  },
  watch: {
    "requests.page": async function (_, __) {
      await this.getProductRequests();
    },
  },
};
</script>

<style scoped></style>
