<template>
  <div class="row" ref="branches-list" v-if="stockist">
    <div class="col-12">
      <div class="row mb-3">
        <div class="col-12 d-flex justify-content-start">
          <vs-button icon dark circle @click="$router.back()">
            <i class="bx bxs-left-arrow-alt"></i>
          </vs-button>
          <h3 class="display-4">Stockist ({{stockist.full_name}})</h3>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-lg-8">
          <stockist-product-bank-list :stockist="stockist"></stockist-product-bank-list>
        </div>
        <div class="col-lg-4">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-0 text-success">Stockist Wallet<br>Balance</h4>
              <div class="d-flex justify-content-between align-items-center">
                <div class="d-inline-block pt-3">
                  <div class="d-flex">
                    <p class="mb-2 ml-1">
                      {{ stockist.domain.country.currency.symbol }}
                    </p>
                    <h2 class="mb-0">
                      {{ stockist.stockist_wallet_balance | number }}
                    </h2>
                  </div>
                  <small class="text-gray">
                    Amount available to you for withdrawal.
                    This figure is updated for every confirmed withdrawal.
                  </small>
                </div>
                <div class="d-inline-block">
                  <div class="bg-success px-4 py-2 rounded">
                    <i class="mdi mdi-wallet text-white icon-lg"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-12 profile-page" ref="details" style="min-height: 400px;">
          <div class="card card-body">
            <div class="profile-body pt-0">
              <ul class="nav tab-switch no-wrap flex-nowrap mb-3"
                  style="overflow-x: auto;" role="tablist">
                <li class="nav-item">
                  <a class="nav-link active" id="user-profile-info-tab"
                     data-toggle="pill" href="#user-profile-info" role="tab"
                     aria-controls="user-profile-info" aria-selected="true">Profile</a>
                </li>
                <li class="nav-item" @click="loadWithdrawals">
                  <a class="nav-link" id="user-profile-withdrawals-tab"
                     data-toggle="pill" href="#user-profile-withdrawals"
                     role="tab" aria-controls="user-profile-withdrawals"
                     aria-selected="false">Withdrawals</a>
                </li>
                <li class="nav-item" @click="loadTransactions">
                  <a class="nav-link" id="user-profile-transactions-tab"
                     data-toggle="pill" href="#user-profile-transactions"
                     role="tab" aria-controls="user-profile-transactions"
                     aria-selected="false">Transactions</a>
                </li>
              </ul>

              <div class="tab-content tab-body">
                <div class="tab-pane fade pr-3 active show" id="user-profile-info" role="tabpanel"
                     aria-labelledby="user-profile-info-tab">
                  <div class="row d-flex">
                    <div class="col-md-auto col-sm-12 grid-margin grid-margin-md-0 d-sm-flex justify-content-start flex-column">
                      <vs-avatar class="position-relative member-profile-photo" :warn="stockist.pending" :danger="stockist.inActive"
                                 :dark="stockist.muted" square
                                 :success="stockist.active" size="200">
                        <template #text v-if="!stockist.avatar">
                          {{ stockist.full_name }}
                        </template>

                        <img :src="stockist.avatar" v-if="stockist.avatar" alt="">

                      </vs-avatar>

                    </div>
                    <div class="col">
                      <div class="card bg-light">
                        <div class="card-body table-responsive">
                          <h4 class="card-title">Information</h4>

                          <div class="row">
                            <div class="col-sm-6 col-md grid-margin grid-margin-md-0">
                              <p class="pb-0 mb-0">First Name:</p>
                              <h5 class="p-0 m-0">
                                <a href="#" id="first_name"
                                   class="as-editable kyc first-name text-dark"
                                   data-type="text"
                                   :data-pk="stockist.id"
                                   :data-url="API_URL + '/members/update/profile'"
                                   data-title="Enter: First Name"
                                >
                                  {{ stockist.first_name }}
                                </a>
                              </h5>
                            </div>

                            <div class="col-sm-6 col-md grid-margin grid-margin-md-0">
                              <p class="pb-0 mb-0">Last Name:</p>
                              <h5 class="p-0 m-0">
                                <a href="#" id="last_name"
                                   class="as-editable kyc first-name text-dark"
                                   data-type="text"
                                   :data-pk="stockist.id"
                                   :data-url="API_URL + '/members/update/profile'"
                                   data-title="Enter: Last Name"
                                >
                                  {{ stockist.last_name }}
                                </a>
                              </h5>
                            </div>

                            <div class="col-sm-6 col-md grid-margin grid-margin-md-0">
                              <p class="pb-0 mb-0">Phone:</p>
                              <h5 class="p-0 m-0">
                                <a href="#" id="phone"
                                   class="as-editable kyc text-dark phone"
                                   data-type="text"
                                   :data-pk="stockist.id"
                                   :data-url="API_URL + '/members/update/profile'"
                                   data-title="Enter: Phone">
                                  {{ stockist.phone }}
                                </a>
                              </h5>
                            </div>

                            <div class="col-sm-5 col-md grid-margin grid-margin-md-0">
                              <p class="pb-0 mb-0">Branch/Country</p>
                              <h5 class="p-0 m-0" style="white-space: nowrap">
                            <span>
                              {{ stockist.branch.name }}
                            </span>
                                /
                                <span class="font-weight-semibold">
                              {{ stockist.domain.country.name }}
                            </span>
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="" v-if="stockist.bank_details">
                        <div class="card bg-transparent">
                          <div class="card-body table-responsive">
                            <h4 class="card-title">Bank Details</h4>

                            <div class="row flex-wrap">
                              <div class="col-sm-6 col-md grid-margin grid-margin-md-0">
                                <p class="pb-0 mb-0">Bank Name:</p>
                                <h5 class="p-0 m-0">
                                  <a href="#" id="bank_name"
                                     class="bank-name text-dark bank-details"
                                     :class="{'as-editable': (($root.authMember && stockist.inActive) || !$root.authMember)}"
                                     data-type="text"
                                     :data-pk="stockist.id"
                                     :data-url="API_URL + '/members/update/bank-details'"
                                     data-title="Enter: Bank Name.">
                                    {{ stockist.bank_details.bank_name }}
                                  </a>
                                </h5>
                              </div>

                              <div class="col-sm-6 col-md grid-margin grid-margin-md-0">
                                <p class="pb-0 mb-0">Account Number:</p>
                                <h5 class="p-0 m-0">
                                  <a href="#" id="bank_account_number"
                                     class="text-dark bank-details ac-number"
                                     data-type="text"
                                     :class="{'as-editable': (($root.authMember && stockist.inActive) || !$root.authMember)}"
                                     :data-pk="stockist.id"
                                     :data-url="API_URL + '/members/update/bank-details'"
                                     data-title="Enter: Account Number">
                                    {{ stockist.bank_details.bank_account_number }}
                                  </a>
                                </h5>
                              </div>

                              <div class="col-sm-6 col-md grid-margin grid-margin-md-0">
                                <p class="pb-0 mb-0">Account Holder Name:</p>
                                <h5 class="p-0 m-0">
                                  <a href="#" id="account_holder_name"
                                     class="text-dark bank-details account-holder-name"
                                     :class="{'as-editable': (($root.authMember && stockist.inActive) || !$root.authMember)}"
                                     data-type="text"
                                     :data-pk="stockist.id"
                                     :data-url="API_URL + '/members/update/bank-details'"
                                     data-title="Enter: Account Holder Name">
                                    {{ stockist.bank_details.account_holder_name }}
                                  </a>
                                </h5>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="bg-light" v-if="stockist.next_of_kin">
                        <div class="card bg-transparent">
                          <div class="card-body table-responsive">
                            <h4 class="card-title">Next of Kin</h4>

                            <div class="row flex-wrap">
                              <div class="col-sm-6 col-md grid-margin grid-margin-md-0">
                                <p class="pb-0 mb-0">Name:</p>
                                <h5 class="p-0 m-0">
                                  <a href="#" data-name="name"
                                     class="as-editable text-dark nok"
                                     data-type="text"
                                     :data-pk="stockist.id"
                                     :data-url="API_URL + '/members/update/nok'"
                                     data-title="Enter: Next of Kin Name.">
                                    {{ stockist.next_of_kin.name }}
                                  </a>
                                </h5>
                              </div>

                              <div class="col-sm-6 col-md grid-margin grid-margin-md-0">
                                <p class="pb-0 mb-0">Phone:</p>
                                <h5 class="p-0 m-0">
                                  <a href="#" data-name="phone"
                                     class="as-editable text-dark nok"
                                     data-type="text"
                                     :data-pk="stockist.id"
                                     :data-url="API_URL + '/members/update/nok'"
                                     data-title="Enter: Next of Kin Phone.">
                                    {{ stockist.next_of_kin.phone }}
                                  </a>
                                </h5>
                              </div>

                              <div class="col-sm-6 col-md grid-margin grid-margin-md-0">
                                <p class="pb-0 mb-0">Email:</p>
                                <h5 class="p-0 m-0">
                                  <a href="#" data-name="email"
                                     class="as-editable text-dark nok"
                                     data-type="text"
                                     :data-pk="stockist.id"
                                     :data-url="API_URL + '/members/update/nok'"
                                     data-title="Enter: Next of Kin Email.">
                                    {{ stockist.next_of_kin.email }}
                                  </a>
                                </h5>
                              </div>

                              <div class="col-sm-6 col-md grid-margin grid-margin-md-0">
                                <p class="pb-0 mb-0">Address:</p>
                                <h5 class="p-0 m-0">
                                  <a href="#" data-name="address"
                                     class="as-editable text-dark nok"
                                     data-type="text"
                                     :data-pk="stockist.id"
                                     :data-url="API_URL + '/members/update/nok'"
                                     data-title="Enter: Next of Kin Address.">
                                    {{ stockist.next_of_kin.address }}
                                  </a>
                                </h5>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="tab-pane fade pr-3 " id="user-profile-withdrawals" role="tabpanel"
                     aria-labelledby="user-profile-info-tab">
                  <div class="d-flex justify-content-between ">
                    <div>
                      <h4 class="card-title mb-0">Withdrawals</h4>
                      <p class="text-small text-muted">
                        Track / View list of all your withdrawals.
                      </p>
                    </div>

                  </div>

                  <div class="table-responsive" style="height: 450px; overflow-y: auto;">
                    <table class="table table-hover table-condensed">
                      <thead>
                      <tr>
                        <th style="width: 5px;"></th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Paid On</th>
                        <th>Created At</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="(withdrawal, index) in withdrawals.data" :key="index">
                        <td>{{index + 1}}</td>
                        <td>{{withdrawal.amount | number}}</td>
                        <td>
                      <span class="badge" :class="{'badge-warning': !withdrawal.paid,
                      'badge-success': withdrawal.paid}">
                        {{withdrawal.paid ? 'PAID': 'PENDING'}}
                      </span>
                        </td>
                        <td>{{(withdrawal.paid_at || withdrawal.created_at) | date}}</td>
                        <td>{{withdrawal.created_at | date}}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>

                  <div class="pt-4" v-if="withdrawals.totalPages">
                    <vs-pagination v-model="withdrawals.page" :length="withdrawals.totalPages" />
                  </div>

                </div>

                <div class="tab-pane fade pr-3 " id="user-profile-transactions" role="tabpanel"
                     aria-labelledby="user-profile-info-tab">

                  <transactions-data-list
                    description="View all your transactions"
                    :transactions="transactions.data">
                  </transactions-data-list>

                  <div class="pt-4" v-if="transactions.totalPages">
                    <vs-pagination v-model="transactions.page" :length="transactions.totalPages" />
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
import StockistProductBankList from "~/components/stockist-product-bank-list";
import MemberInfoCard from "~/components/MemberInfoCard";
import TransactionsDataList from "~/components/TransactionsDataList";
import _ from "lodash";
export default {
  name: "stockist-details",
  components: {TransactionsDataList, MemberInfoCard, StockistProductBankList},
  layout: "app",
  data(){
    return {
      stockist: null,
      transactions: {
        data: [],
        pagination: null,
        page: 1,
        totalPages: null,
      },
      withdrawals: {
        data: [],
        pagination: null,
        page: 1,
        totalPages: null,
      },
    }
  },
  methods: {
    async getStockistDetails() {
      const loading = this.$vs.loading({
        text: 'Please wait...'
      });

      try {
        const username = this.$nuxt.context.params.username;

        this.stockist = await this.$axios.$get(`/members/stockists/${username}/details/`);

      } catch (e){
        console.log('error placing request', e.response);
      } finally {
        loading.close();
      }

    },
    async loadWithdrawals() {
      await this.$doTask(async () => {
        const username = this.username;

        let response = await this.$axios.$get('members/' + username + '/withdrawals', {
          params: {
            page: this.withdrawals.page
          }
        });

        this.withdrawals.data = response.data;
        this.withdrawals.totalPages = response.last_page;

      }, 'Load member Withdrawals', this.$refs['details']);
    },
    async loadTransactions() {
      await this.$doTask(async () => {
        const username = this.username;

        let response = await this.$axios.$get('members/' + username + '/transactions', {
          params: {
            page: this.transactions.page
          }
        });

        this.transactions.data = response.data;
        this.transactions.totalPages = response.total;

      }, 'Load member transactions', this.$refs['details']);
    },
  },
  mounted() {
    this.getStockistDetails();
  },
  computed: {
    API_URL(){
      return this.$config.apiRoot;
    }
  },
  watch: {
    'transactions.page': function(page, __){
      this.loadTransactions();
    },
    'withdrawals.page': function(page, __){
      this.loadWithdrawals();
    },
  }
}
</script>

<style scoped>

</style>
