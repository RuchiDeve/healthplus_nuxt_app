<template>
  <div class="row">
    <div class="col-12">
      <div class="d-flex justify-content-between mt-5 mb-3">
        <h4 class="display-4">Deposits</h4>
        <new-deposits></new-deposits>
      </div>

      <div
        class="d-flex flex-nowrap row"
        style="overflow-x: auto; min-height: 150px"
        ref="deposits-stat"
      >
        <div class="col">
          <div class="card card-statistics">
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-center">
                <div class="highlight-icon bg-light mr-3">
                  <i class="mdi mdi-check-circle text-success icon-lg"></i>
                </div>
                <div class="wrapper">
                  <p class="card-text no-wrap mb-0">Total Deposits</p>
                  <div class="fluid-container">
                    <h3 class="card-title mb-0">
                      {{ stats.totalDeposits | number }}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card card-statistics">
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-center">
                <div class="highlight-icon bg-light mr-3">
                  <i class="mdi mdi-check-circle text-success icon-lg"></i>
                </div>
                <div class="wrapper">
                  <p class="card-text no-wrap mb-0">Total Confirmed</p>
                  <div class="fluid-container">
                    <h3 class="card-title mb-0">
                      {{ stats.totalAmountConfirmed | number }}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card card-statistics">
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-center">
                <div class="highlight-icon bg-light mr-3">
                  <i class="mdi mdi-alert text-warning icon-lg"></i>
                </div>
                <div class="wrapper">
                  <p class="card-text no-wrap mb-0">Total Pending</p>
                  <div class="fluid-container">
                    <h3 class="card-title mb-0">
                      {{ stats.totalPending | number }}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card card-statistics">
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-center">
                <div class="highlight-icon bg-light mr-3">
                  <i class="mdi mdi-alert text-warning icon-lg"></i>
                </div>
                <div class="wrapper">
                  <p class="card-text no-wrap mb-0">Total Amount Pending</p>
                  <div class="fluid-container">
                    <h3 class="card-title mb-0">
                      {{ stats.totalAmountPending | number }}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card card-statistics">
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-center">
                <div class="highlight-icon bg-light mr-3">
                  <i class="mdi mdi-alert text-warning icon-lg"></i>
                </div>
                <div class="wrapper">
                  <p class="card-text no-wrap mb-0">
                    Total Deposit Wallet Balance
                  </p>
                  <div class="fluid-container">
                    <h3 class="card-title mb-0">
                      {{ parseFloat(stats.depositBalance) | number }}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div
            class="card card-body"
            ref="deposit-list"
            style="min-height: 300px"
          >
            <div class="d-flex justify-content-between">
              <div class="d-flex grid-margin" v-if="totalPages">
                <span class="align-self-center badge badge-info">
                  Page: <b>{{ page }} of {{ totalPages }}</b>
                </span>
              </div>

              <div class="">
                <div class="btn-group btn-group-sm">
                  <button
                    class="btn btn-sm btn-outline-primary"
                    @click="showSearchDialog = !showSearchDialog"
                    data-toggle="modal"
                    data-target="#searchModal"
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
                </div>
                <deposit-search-dialog
                  @closed="showSearchDialog = false"
                  :show="showSearchDialog"
                  @search="searchDeposit($event)"
                ></deposit-search-dialog>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-hover table-condensed">
                <thead>
                  <tr>
                    <th style="width: 5px"></th>
                    <th></th>
                    <th>Depositor</th>
                    <th>Ref.</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(deposit, index) in deposits" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>
                      <vs-avatar size="40" square>
                        <template #text v-if="!deposit.depositor.avatar">
                          {{ deposit.depositor.full_name }}
                        </template>

                        <img
                          :src="deposit.depositor.avatar"
                          v-if="deposit.depositor.avatar"
                          alt=""
                        />
                      </vs-avatar>
                    </td>
                    <td>
                      <span class="font-weight-semibold">{{
                        deposit.depositor.full_name
                      }}</span>
                      <br />
                      <span>{{ deposit.depositor.user.username }}</span>
                    </td>
                    <td style="width: 30px">{{ deposit.reference_number }}</td>
                    <td class="font-weight-bold">
                      {{ deposit.amount | number }}
                    </td>
                    <td>{{ deposit.deposited_on | date }}</td>
                    <td>
                      <div class="d-flex align-items-center">
                        <span
                          class="badge"
                          :class="{
                            'badge-warning': !deposit.confirmed,
                            'badge-success': deposit.confirmed,
                          }"
                        >
                          {{ deposit.confirmed ? "CONFIRMED" : "PENDING" }}
                        </span>
                        <div v-if="!deposit.confirmed">
                          <vs-button
                            size="small"
                            success
                            @click="confirmDeposit(deposit)"
                          >
                            <i class="ti-check"></i>
                            confirm
                          </vs-button>
                          <vs-button
                            size="small"
                            danger
                            @click="deleteDeposit(deposit)"
                          >
                            <i class="ti-check"></i>
                            delete
                          </vs-button>
                        </div>
                        <vs-button
                          blank
                          active
                          primary
                          size="small"
                          :href="
                            '/members/' +
                            deposit.depositor.user.username +
                            '/details'
                          "
                        >
                          <i class="ti-eye"></i>
                          Show member
                        </vs-button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="col-12 mt-4" v-if="totalPages">
            <vs-pagination v-model="page" :length="totalPages" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MemberInfoCard from "@/components/MemberInfoCard";
import _ from "lodash";
import PaymentChannelSelectorInput from "@/components/inputs/PaymentChannelSelectorInput";
import NewDeposits from "@/components/NewDeposits";
import DepositSearchDialog from "@/components/DepositSearchDialog";
export default {
  name: "index",
  components: {
    NewDeposits,
    PaymentChannelSelectorInput,
    MemberInfoCard,
    DepositSearchDialog,
  },
  layout: "app",
  data() {
    return {
      deposits: [],
      totalPages: 1,
      page: 1,
      stats: {
        totalDeposits: 0,
        totalAmountConfirmed: 0,
        totalPending: 0,
        totalAmountPending: 0,
        depositBalance: 0,
      },
      showSearchDialog: false,
      searchPayload: null,
    };
  },
  methods: {
    async getDeposits() {
      await this.$doTask(async () => {
        let response = await this.$axios.get("deposits", {
          params: {
            page: this.page,
            ...this.searchPayload,
          },
        });

        this.deposits = response.data.data;
        // this.pagination = response.data.pagination;
        this.totalPages = response.data.last_page;
      }, "Fetching deposits");
    },
    async getDepositsDataStats() {
      await this.$doTask(
        async () => {
          let response = await this.$axios.get("reports/deposits/statistics");
          this.stats.totalAmountConfirmed = response.data.total_paid_amount;
          this.stats.totalDeposits = response.data.total;
          this.stats.totalPending = response.data.total_pending_count;
          this.stats.totalAmountPending = response.data.total_pending_amount;
          this.stats.depositBalance = response.data.deposit_balance;
        },
        "Loading...",
        this.$refs["deposits-stat"]
      );
    },
    async confirmDeposit(deposit) {
      if (!confirm("Are you sure?")) return;

      await this.$doTask(async () => {
        let response = await this.$axios.post("deposits/confirm/" + deposit.id);
        console.log("confirmed", response.data);
      }, "Confirming...");

      deposit.confirmed = true;
    },
    async deleteDeposit(deposit) {
      if (!confirm("Are you sure?")) return;

      await this.$doTask(async () => {
        let response = await this.$axios.post("deposits/delete/" + deposit.id);
        console.log("deposit deleted", response.data);
      }, "Deleting...");

      window.location.reload();
    },
    searchDeposit(payload) {
      this.searchPayload = payload;
      this.getDeposits();
    },
    resetSearch() {
      this.searchPayload = null;
      this.getDeposits();
    },
  },
  mounted() {
    this.getDeposits();
    this.getDepositsDataStats();
  },
  watch: {
    page(__, ___) {
      this.getDeposits();
    },
  },
};
</script>

<style scoped></style>
