<template>

  <div class="row">
    <div class="col-12">
      <div class="d-flex justify-content-between mt-5 mb-3">
        <h4 class="display-4">Withdrawal Requests</h4>
        <new-withdrawal></new-withdrawal>
      </div>

      <div class="d-flex flex-nowrap row" style="overflow-x: auto; min-height: 150px;" ref="withdrawal-stat">
        <div class="col">
          <div class="card card-statistics">
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-center">
                <div class="highlight-icon bg-light mr-3">
                  <i class="mdi mdi-check-circle text-success icon-lg"></i>
                </div>
                <div class="wrapper">
                  <p class="card-text no-wrap mb-0">Total Paid</p>
                  <div class="fluid-container">
                    <h3 class="card-title text-success mb-0">{{stats.totalPaidRequestsCount | number}}</h3>
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
                    <h3 class="card-title text-warning mb-0">{{stats.totalPendingRequestsCount | number}}</h3>
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
                  <p class="card-text no-wrap  mb-0">Total Amount Paid</p>
                  <div class="fluid-container">
                    <h3 class="card-title text-success mb-0">{{stats.totalPaidRequests | number}}</h3>
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
                    <h3 class="card-title text-warning mb-0">{{stats.totalPendingRequests | number}}</h3>
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
                  <i class="mdi mdi-cash-register text-primary icon-lg"></i>
                </div>
                <div class="wrapper">
                  <p class="card-text no-wrap  mb-0">Total Wallet Balance</p>
                  <div class="fluid-container">
                    <h3 class="card-title text-primary mb-0">{{stats.totalWalletBalance | number}}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card card-body" ref="deposit-list" style="min-height: 300px">
            <div class="d-flex justify-content-between">
              <div class="d-flex grid-margin" v-if="totalPages">
              <span class="align-self-center badge badge-info">
                    Page: <b>{{ page }} of {{totalPages}}</b>
                  </span>
              </div>
              <div>
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-outline-primary"
                          @click="showSearchDialog = !showSearchDialog">
                    <i class="mdi mdi-account-search"></i>
                    Search...
                  </button>
                  <button v-show="searchPayload !== null"
                          class="btn btn-danger" @click="resetSearch">
                    <i class="bx bxs-x-square"></i>
                  </button>
                  <withdrawal-search-dialog :show="showSearchDialog"
                                            @closed="showSearchDialog = false"
                                            @search="searchWithdrawal($event)"></withdrawal-search-dialog>
                </div>
              </div>
            </div>

            <div class="table-responsive">
              <div class="text-warning">
                <span class="font-weight-bold">NOTE:</span>
                All withdrawals attracts a fee of N105 only
              </div>
              <table class="table table-hover table-condensed">
                <thead>
                <tr>
                  <th style="width: 5px;"></th>
                  <th></th>
                  <th>Member</th>
                  <th>Account Details</th>
                  <th>Amount<br> To Withdraw</th>
                  <th>Amount<br> To receive</th>
                  <th>Paid On</th>
                  <th>Created at</th>
                  <td></td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(withdrawal, index) in withdrawals" :key="index">
                  <td>{{index + 1}}</td>
                  <td>
                    <vs-avatar size="40" square>
                      <template #text v-if="!withdrawal.member.avatar">
                        {{ withdrawal.member.full_name }}
                      </template>
                      <img :src="$backendFiles(withdrawal.member.avatar)" v-if="withdrawal.member.avatar" alt="">
                    </vs-avatar>
                  </td>
                  <td>
                    <span class="font-weight-semibold">{{withdrawal.member.full_name}}</span>
                    <br>
                    <span>{{withdrawal.member.user.username}}</span>
                  </td>
                  <td>
                    <span class="font-weight-semibold d-block mb-2">
                      {{withdrawal.member.bank_details.bank_account_number}}
                    </span>
                    <span class="d-block mb-2" v-show="withdrawal.member.bank_details.account_holder_name">
                      {{withdrawal.member.bank_details.account_holder_name}}
                    </span>
                    <span class="d-block" v-show="withdrawal.member.bank_details.bank_name">
                      {{withdrawal.member.bank_details.bank_name}}
                    </span>
                  </td>
                  <td class="font-weight-bold">{{withdrawal.amount | currency}}</td>
                  <td class="font-weight-bold">{{withdrawal.amount - 105 | currency}}</td>
                  <td>
                    <span class="" v-show="withdrawal.paid">{{withdrawal.paid_at | date}}</span>
                  </td>
                  <td>
                    <span class="">{{withdrawal.created_at | date}}</span>
                  </td>
                  <td class="">
                    <div class="d-flex align-items-center">
                      <span class="badge" :class="{'badge-warning': !withdrawal.paid,
                      'badge-success': withdrawal.paid}">
                        {{withdrawal.paid ? 'PAID': 'PENDING'}}
                      </span>
                      <vs-button blank active primary size="small"
                                 :href="'/members/' + withdrawal.member.user.username + '/details'">
                        <i class="ti-eye"></i>
                        Show member
                      </vs-button>
                      <div v-if="!withdrawal.paid">
                        <vs-button size="small" success @click="confirmWithdrawal(withdrawal)">
                          <i class="ti-check"></i>
                          confirm
                        </vs-button>
                        <vs-button size="small" danger @click="deleteWithdrawal(withdrawal)">
                          <i class="ti-trash"></i>
                          delete
                        </vs-button>
                      </div>
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
import NewWithdrawal from "@/components/NewWithdrawal";
import WithdrawalSearchDialog from "~/components/WithdrawalSearchDialog";
export default {
  name: "index",
  components: {WithdrawalSearchDialog, NewWithdrawal, MemberInfoCard},
  layout: "app",
  data(){
    return {
      withdrawals: [],
      totalPages: 1,
      page: 1,
      pagination: null,
      searchPayload: null,
      showSearchDialog: false,
      stats: {
        totalPaidRequestsCount: 0,
        totalPendingRequestsCount: 0,
        totalPendingRequests: 0,
        totalPaidRequests: 0,
        totalWalletBalance: 0,
      },
    }
  },
  methods: {
    async getWithdrawals(){
      await this.$doTask(async () => {
        let response = await this.$axios.get("withdrawals", {
          params: {
            page: this.page,
            ...this.searchPayload
          }
        });

        this.withdrawals = response.data.data;
        // this.pagination = response.data.pagination;
        this.totalPages = response.data.last_page;

      }, "Fetching withdrawal requests");
    },
    async confirmWithdrawal(withdrawal){
      if (!confirm('Are you sure?')) return;

      await this.$doTask(async () => {
        let response = await this.$axios.post("withdrawals/confirm/" + withdrawal.id);
        console.log('confirmed', response.data);
      }, "Confirming...");

      withdrawal.paid = true;
    },
    async getWithdrawalDataStats(){
      await this.$doTask(async () => {
        let response = await this.$axios.get('reports/withdrawals/statistics');
        this.stats.totalPaidRequestsCount = response.data.total_paid_count;
        this.stats.totalPendingRequestsCount = response.data.total_pending_count;
        this.stats.totalPendingRequests = response.data.total_pending_amount;
        this.stats.totalPaidRequests = response.data.total_paid_amount;
        this.stats.totalWalletBalance = parseFloat(response.data.total_wallet_balance);
      }, "Loading...", this.$refs["withdrawal-stat"])
    },
    async deleteWithdrawal(withdrawal){
      if (!confirm('Are you sure?')) return;

      await this.$doTask(async () => {
        let response = await this.$axios.post("withdrawals/delete/" + withdrawal.id);
        console.log('delete', response.data);
      }, "Deleting...");

      window.location.reload();
    },
    searchWithdrawal(payload){
      this.searchPayload = payload;
      this.getWithdrawals();
    },
    resetSearch(){
      this.searchPayload = null;
      this.getWithdrawals();
    }
  },
  mounted() {
    this.getWithdrawals();
    this.getWithdrawalDataStats();
  },
  watch: {
    page(_, __){
      this.getWithdrawals();
    }
  }

}
</script>

<style scoped>

</style>
