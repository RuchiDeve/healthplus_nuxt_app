<template>

  <div class="row" v-if="member">
    <div class="col-12">
      <div class="card card-body bg-transparent">
        <div class="d-flex justify-content-between">
          <div class="d-flex">
            <div class="mr-2">
              <vs-avatar class="d-inline-block" :warn="member.is_pending" :danger="member.is_inactive"
                         :dark="member.is_mute"
                         :success="member.is_active" size="55" circle>
                <template #text v-if="!member.avatar">
                  {{ member.full_name }}
                </template>

                <img :src="$backendFiles(member.avatar)" v-if="member.avatar" alt="">
              </vs-avatar>
            </div>
            <div>
              <h4 class="display-4 mb-0">
                {{ member.full_name }}
              </h4>
              <p class="mt-0 pt-0 font-weight-semibold">

          <span class="badge badge-dark">
            {{ member.user.username }}
          </span>

                <span v-if="member.is_inactive" class="mdi mdi-18px mdi-cancel text-danger"></span>
                <span v-else-if="member.is_pending" class="mdi mdi-18px mdi-bell-alert text-warning"></span>
                <span v-else-if="member.is_active" class="mdi mdi-18px mdi-check-circle text-success"></span>
                <span v-else-if="member.is_mute" class="mdi mdi-18px mdi-account-off text-muted"></span>

                <span v-if="member.is_mute" class="text-gray">Muted</span>
                <span v-else-if="member.is_active" class="text-success">Active</span>
                <span v-else-if="member.is_pending" class="text-warning">Pending</span>
                <span v-else-if="member.is_inactive" class="text-danger">Inactive</span>

              </p>
            </div>
          </div>
          <div class="float-right" v-if="!$root.authMember">
            <vs-button
              icon
              dark
              border
              @click="$router.back()"
            >
              <i class='bx bxs-chevrons-left'></i>
              Back
            </vs-button>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12">
      <div class="row member-stats">
        <div class="col-12 grid-margin">
          <div class="row d-flex no-wrap flex-nowrap" style="overflow-x: auto">
            <div style="min-width: 230px;" class="col">
              <div class="card card-statistics">
                <div class="card-body">
                  <div class="d-flex align-items-center justify-content-center">
                    <div class="highlight-icon bg-light mr-3">
                      <i class="mdi mdi-account text-primary icon-lg"></i>
                    </div>
                    <div class="wrapper">
                      <p class="card-text no-wrap mb-0">State Rep ID</p>
                      <div class="fluid-container">
                        <h3 class="card-title mb-0 no-wrap text-primary">
                          {{ member.state_rep_id }}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style="min-width: 230px;" class="col">
              <div class="card card-statistics">
                <div class="card-body">
                  <div class="d-flex align-items-center justify-content-center">
                    <div class="highlight-icon bg-light mr-3">
                      <i class="mdi mdi-shopping text-success icon-lg"></i>
                    </div>
                    <div class="wrapper">
                      <p class="card-text mb-0">Monthly Orders</p>
                      <div class="fluid-container">
                        <h3 class="card-title mb-0 no-wrap text-success">
                          {{ (member.monthly_orders_count || 0) | number}}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style="min-width: 230px;" class="col">
              <div class="card card-statistics">
                <div class="card-body">
                  <div class="d-flex align-items-center justify-content-center">
                    <div class="highlight-icon bg-light mr-3">
                      <i class="mdi mdi-check-box-multiple-outline text-complete icon-lg"></i>
                    </div>
                    <div class="wrapper">
                      <p class="card-text mb-0">Monthly Points</p>
                      <div class="fluid-container">
                        <h3 class="card-title no-wrap mb-0 text-complete">
                          {{ member.monthly_orders_sum_total_points | number}}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style="min-width: 230px;" class="col ">
              <div class="card card-statistics">
                <div class="card-body">
                  <div class="d-flex align-items-center justify-content-center">
                    <div class="highlight-icon bg-light mr-3">
                      <i class="mdi mdi-calendar-clock icon-lg"></i>
                    </div>
                    <div class="wrapper">
                      <p class="card-text no-wrap mb-0">Target Start Date</p>
                      <div class="fluid-container">
                        <h5 class="card-title no-wrap mb-0">
                          {{ member.target_start_date | date }}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style="min-width: 230px;" class="col ">
              <div class="card card-statistics">
                <div class="card-body">
                  <div class="d-flex align-items-center justify-content-center">
                    <div class="highlight-icon bg-light mr-3">
                      <i class="mdi mdi-calendar-clock text-warning icon-lg"></i>
                    </div>
                    <div class="wrapper">
                      <p class="card-text no-wrap mb-0">Target End Date</p>
                      <div class="fluid-container">
                        <h5 class="card-title no-wrap mb-0 text-warning">
                          {{ member.target_end_date | date }}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>


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
            <li class="nav-item" @click="loadOrders">
              <a class="nav-link" id="user-profile-orders-tab"
                 data-toggle="pill" href="#user-profile-orders"
                 role="tab" aria-controls="user-profile-orders"
                 aria-selected="false">Orders</a>
            </li>
            <li class="nav-item" @click="loadPayments">
              <a class="nav-link" id="user-profile-payments-tab"
                 data-toggle="pill" href="#user-profile-payments"
                 role="tab" aria-controls="user-profile-payments"
                 aria-selected="false">Payments</a>
            </li>
          </ul>

          <div class="tab-content tab-body">
            <div class="tab-pane fade pr-3 active show" id="user-profile-info" role="tabpanel"
                 aria-labelledby="user-profile-info-tab">
              <div class="row d-flex">
                <div class="col-md-auto col-sm-12 grid-margin grid-margin-md-0 d-sm-flex justify-content-start flex-column">
                  <vs-avatar class="position-relative member-profile-photo" :warn="member.pending" :danger="member.inActive"
                             :dark="member.muted" square
                             :success="member.active" size="200">
                    <template #text v-if="!member.avatar">
                      {{ member.full_name }}
                    </template>

                    <img :src="$backendFiles(member.avatar)" v-if="member.avatar" alt="">

                  </vs-avatar>

                </div>

                <div class="col">
                  <div class="card bg-light">
                    <div class="card-body table-responsive">
                      <h4 class="card-title">Profile / KYC</h4>

                      <div class="row">
                        <div class="col-sm-6 col-md grid-margin grid-margin-md-0">
                          <p class="pb-0 mb-0">First Name:</p>
                          <h5 class="p-0 m-0">
                            <a href="#" id="first_name"
                               class="first-name text-dark"
                               data-type="text"
                               :data-pk="member.id"
                               :data-url="API_URL + '/members/update/profile'"
                               data-title="Enter: First Name"
                            >
                              {{ member.first_name }}
                            </a>
                          </h5>
                        </div>

                        <div class="col-sm-6 col-md grid-margin grid-margin-md-0">
                          <p class="pb-0 mb-0">Last Name:</p>
                          <h5 class="p-0 m-0">
                            <a href="#" id="last_name"
                               class="last-name text-dark"
                               data-type="text"
                               :data-pk="member.id"
                               :data-url="API_URL + '/members/update/profile'"
                               data-title="Enter: Last Name"
                            >
                              {{ member.last_name }}
                            </a>
                          </h5>
                        </div>

                        <div class="col-sm-6 col-md grid-margin grid-margin-md-0">
                          <p class="pb-0 mb-0">Phone:</p>
                          <h5 class="p-0 m-0">
                            <a href="#" id="phone"
                               class=" text-dark phone"
                               data-type="text"
                               :data-pk="member.id"
                               :data-url="API_URL + '/members/update/profile'"
                               data-title="Enter: Phone">
                              {{ member.phone }}
                            </a>
                          </h5>
                        </div>

                        <div class="col-sm-5 col-md grid-margin grid-margin-md-0">
                          <p class="pb-0 mb-0">Branch/Country</p>
                          <h5 class="p-0 m-0" style="white-space: nowrap">
                            <span>
                              {{ member.branch.name }}
                            </span>
                            /
                            <span class="font-weight-semibold">
                              {{ member.domain.country.name }}
                            </span>
                          </h5>
                        </div>

                        <div class="col-sm-6 col-md grid-margin grid-margin-md-0">
                          <p class="pb-0 mb-0">Target Point:</p>
                          <h5 class="p-0 m-0">
                            <a href="#" id="target_cpt"
                               class="as-editable kyc target-point text-dark"
                               data-type="text"
                               :data-pk="member.id"
                               :data-url="API_URL + '/members/update/profile'"
                               data-title="Enter: Target Point"
                            >
                              {{ member.target_cpt }}
                            </a>
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="" v-if="member.bank_details">
                    <div class="card bg-transparent">
                      <div class="card-body table-responsive">
                        <h4 class="card-title">Bank Details</h4>

                        <div class="row flex-wrap">
                          <div class="col-sm-6 col-md grid-margin grid-margin-md-0">
                            <p class="pb-0 mb-0">Bank Name:</p>
                            <h5 class="p-0 m-0">
                              <a href="#" id="bank_name"
                                 class="bank-name text-dark bank-details"
                                 :class="{'as-editable': (($root.authMember && member.inActive) || !$root.authMember)}"
                                 data-type="text"
                                 :data-pk="member.id"
                                 :data-url="API_URL + '/members/update/bank-details'"
                                 data-title="Enter: Bank Name.">
                                {{ member.bank_details.bank_name }}
                              </a>
                            </h5>
                          </div>

                          <div class="col-sm-6 col-md grid-margin grid-margin-md-0">
                            <p class="pb-0 mb-0">Account Number:</p>
                            <h5 class="p-0 m-0">
                              <a href="#" id="bank_account_number"
                                 class="text-dark bank-details ac-number"
                                 data-type="text"
                                 :class="{'as-editable': (($root.authMember && member.inActive) || !$root.authMember)}"
                                 :data-pk="member.id"
                                 :data-url="API_URL + '/members/update/bank-details'"
                                 data-title="Enter: Account Number">
                                {{ member.bank_details.bank_account_number }}
                              </a>
                            </h5>
                          </div>

                          <div class="col-sm-6 col-md grid-margin grid-margin-md-0">
                            <p class="pb-0 mb-0">Account Holder Name:</p>
                            <h5 class="p-0 m-0">
                              <a href="#" id="account_holder_name"
                                 class="text-dark bank-details account-holder-name"
                                 :class="{'as-editable': (($root.authMember && member.inActive) || !$root.authMember)}"
                                 data-type="text"
                                 :data-pk="member.id"
                                 :data-url="API_URL + '/members/update/bank-details'"
                                 data-title="Enter: Account Holder Name">
                                {{ member.bank_details.account_holder_name }}
                              </a>
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="bg-light" v-if="member.next_of_kin">
                    <div class="card bg-transparent">
                      <div class="card-body table-responsive">
                        <h4 class="card-title">Next of Kin</h4>

                        <div class="row flex-wrap">
                          <div class="col-sm-6 col-md grid-margin grid-margin-md-0">
                            <p class="pb-0 mb-0">Name:</p>
                            <h5 class="p-0 m-0">
                              <a href="#" data-name="name"
                                 class="text-dark nok"
                                 data-type="text"
                                 :data-pk="member.id"
                                 :data-url="API_URL + '/members/update/nok'"
                                 data-title="Enter: Next of Kin Name.">
                                {{ member.next_of_kin.name }}
                              </a>
                            </h5>
                          </div>

                          <div class="col-sm-6 col-md grid-margin grid-margin-md-0">
                            <p class="pb-0 mb-0">Phone:</p>
                            <h5 class="p-0 m-0">
                              <a href="#" data-name="phone"
                                 class="text-dark nok"
                                 data-type="text"
                                 :data-pk="member.id"
                                 :data-url="API_URL + '/members/update/nok'"
                                 data-title="Enter: Next of Kin Phone.">
                                {{ member.next_of_kin.phone }}
                              </a>
                            </h5>
                          </div>

                          <div class="col-sm-6 col-md grid-margin grid-margin-md-0">
                            <p class="pb-0 mb-0">Email:</p>
                            <h5 class="p-0 m-0">
                              <a href="#" data-name="email"
                                 class="text-dark nok"
                                 data-type="text"
                                 :data-pk="member.id"
                                 :data-url="API_URL + '/members/update/nok'"
                                 data-title="Enter: Next of Kin Email.">
                                {{ member.next_of_kin.email }}
                              </a>
                            </h5>
                          </div>

                          <div class="col-sm-6 col-md grid-margin grid-margin-md-0">
                            <p class="pb-0 mb-0">Address:</p>
                            <h5 class="p-0 m-0">
                              <a href="#" data-name="address"
                                 class="text-dark nok"
                                 data-type="text"
                                 :data-pk="member.id"
                                 :data-url="API_URL + '/members/update/nok'"
                                 data-title="Enter: Next of Kin Address.">
                                {{ member.next_of_kin.address }}
                              </a>
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="">
                    <div class="card bg-transparent">
                      <div class="card-body table-responsive">
                        <h4 class="card-title">Membership</h4>

                        <div class="row flex-wrap">
                          <div class="col-sm-6 col-md grid-margin grid-margin-md-0">
                            <p class="pb-0 mb-0">Up Line:</p>
                            <member-info-card :this-member="member.up_line_member"></member-info-card>
                          </div>

                          <div class="col-sm-6 col-md grid-margin grid-margin-md-0">
                            <p class="pb-0 mb-0">Sponsor:</p>
                            <member-info-card :this-member="member.sponsor_member"></member-info-card>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="tab-pane fade pr-3 " id="user-profile-orders" role="tabpanel"
                 aria-labelledby="user-profile-info-tab">
              <div class="d-flex justify-content-between ">
                <div>
                  <h4 class="card-title mb-0">Orders</h4>
                  <p class="text-small text-muted">
                    Track / View list of orders under your coverage.
                  </p>
                </div>

                <div>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary"
                            @click="orderSearchDialog.show = !orderSearchDialog.show">
                      <i class="mdi mdi-account-search"></i>
                      Search...
                    </button>
                    <button v-show="orderSearchDialog.queryData.day !== null || orderSearchDialog.queryData.month !== null ||
orderSearchDialog.queryData.year !== null"
                            class="btn btn-danger" @click="resetOrderSearch">
                      <i class="bx bxs-x-square"></i>
                    </button>
                  </div>
                </div>
              </div>

              <orders-list :orders="orders.data"></orders-list>

              <hr>

              <div>
                <h5 class="card-title mb-0">Total C.Pt.: {{orders.totalPoints | number}}</h5>
              </div>

              <div class="pt-4" v-if="orders.totalPages">
                <vs-pagination v-model="orders.page" :length="orders.totalPages" />
              </div>

            </div>

            <div class="tab-pane fade pr-3 " id="user-profile-payments" role="tabpanel"
                 aria-labelledby="user-profile-info-tab">
              <div class="d-flex justify-content-between ">
                <div>
                  <h4 class="card-title mb-0">My Payments</h4>
                </div>

                <div>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary"
                            @click="paymentSearchDialog.show = !paymentSearchDialog.show">
                      <i class="mdi mdi-account-search"></i>
                      Search...
                    </button>
                    <button v-show="paymentSearchDialog.queryData.day !== null || paymentSearchDialog.queryData.month !== null ||
paymentSearchDialog.queryData.year !== null"
                            class="btn btn-danger" @click="resetPaymentSearch">
                      <i class="bx bxs-x-square"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-12">
                  <div class="card card-body" ref="supplies-list" style="min-height: 300px">
                    <div class="d-flex grid-margin" v-if="payments.totalPages">
                      <vs-pagination only-arrows v-model="payments.page" :length="payments.totalPages" />
                      <span class="align-self-center badge badge-info">
                        Page: <b>{{ payments.page }}</b>
                      </span>
                    </div>
                    <div class="table-responsive">
                      <table class="table table-condensed table-hover">
                        <thead>
                        <tr>
                          <td></td>
                          <td>Target start date</td>
                          <td>Target end date</td>
                          <td>Reached Point</td>
                          <td>Target Point</td>
                          <td>Total Orders</td>
                          <td>Status</td>
                          <td>Amount</td>
                          <td>Date Paid</td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(payment, index) in payments.data" :key="index"
                            :class="{'text-warning': !payment.paid}">
                          <td>{{index + 1}}</td>
                          <td>{{payment.start_date | date}}</td>
                          <td>{{payment.end_date | date }}</td>
                          <td>{{payment.reached_point}}</td>
                          <td>{{payment.target_point}}</td>
                          <td>{{payment.total_orders}}</td>
                          <td>
                    <span class="badge" :class="{'badge-warning': !payment.paid,
                    'badge-success': payment.paid}">
                      {{payment.paid ? 'Paid' : 'Pending'}}
                    </span>
                          </td>
                          <td class="font-weight-bold">{{payment.amount | number}}</td>
                          <td>
                            <span v-show="payment.paid">
                              {{payment.date_paid | date}}
                            </span>
                          </td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div class="col-12 mt-4" v-if="payments.totalPages">
                  <vs-pagination v-model="payments.page" :length="payments.totalPages" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>


    <vs-dialog blur :loading="orderSearchDialog.loading" v-model="orderSearchDialog.show" >
      <template #header>
        <h4 class="not-margin">
          <b>Search</b> orders...
        </h4>
      </template>

      <div class="con-form mt-3">
        <div class="form-group mb-5">
          <vs-input block label="Year" type="number" v-model.number="orderSearchDialog.queryData.year"></vs-input>
        </div>

        <div class="form-group mb-5">
          <vs-input block label="Month" type="number" v-model.number="orderSearchDialog.queryData.month"></vs-input>
        </div>

        <div class="form-group mb-5">
          <vs-input block label="Day" type="number" v-model.number="orderSearchDialog.queryData.day"></vs-input>
        </div>

      </div>

      <template #footer>
        <div class="footer-dialog">
          <vs-button @click="loadOrders" block>
            Search
          </vs-button>
        </div>
      </template>
    </vs-dialog>

    <vs-dialog blur :loading="paymentSearchDialog.loading" v-model="paymentSearchDialog.show" >
      <template #header>
        <h4 class="not-margin">
          <b>Search</b> payment...
        </h4>
      </template>

      <div class="con-form mt-3">
        <div class="form-group mb-5">
          <vs-input block label="Year" type="number" v-model.number="paymentSearchDialog.queryData.year"></vs-input>
        </div>

        <div class="form-group mb-5">
          <vs-input block label="Month" type="number" v-model.number="paymentSearchDialog.queryData.month"></vs-input>
        </div>

        <div class="form-group mb-5">
          <vs-input block label="Day" type="number" v-model.number="paymentSearchDialog.queryData.day"></vs-input>
        </div>

      </div>

      <template #footer>
        <div class="footer-dialog">
          <vs-button @click="loadPayments" block>
            Search
          </vs-button>
        </div>
      </template>
    </vs-dialog>
  </div>

</template>

<script>
import OrdersList from "@/components/OrdersList";
import TransactionsDataList from "@/components/TransactionsDataList";
import SelectStagesInput from "@/components/inputs/SelectStagesInput";
import _ from "lodash";
import ImageUploadInput from "@/components/inputs/ImageUploadInput";
import MemberInfoCard from "@/components/MemberInfoCard";
import MemberCashFlowChart from "@/components/charts/MemberCashFlowChart";
import NewWithdrawal from "@/components/NewWithdrawal";
import NewDeposits from "@/components/NewDeposits";
import ChangeSecurityCredentials from "@/components/security/ChangeSecurityCredentials";

export default {
  name: "MemberDetails",
  components: {
    ChangeSecurityCredentials,
    MemberInfoCard, ImageUploadInput, SelectStagesInput, TransactionsDataList, OrdersList},
  layout: "app",
  data() {
    return {
      stateRepMember: null,
      orders: {
        data: [],
        pagination: null,
        totalPages: null,
        page: 1,
        totalPoints: 0,
      },
      payments: {
        data: [],
        pagination: null,
        totalPages: null,
        page: 1,
      },
      orderSearchDialog: {
        show: false,
        loading:false,
        queryData: {
          year: null,
          month: null,
          day: null,
        },
      },
      paymentSearchDialog: {
        show: false,
        loading:false,
        queryData: {
          year: null,
          month: null,
          day: null,
        },
      },
    }
  },
  props: {
    defaultMember: {
      required: false,
      type: Object
    }
  },
  async fetch() {
    await this.getMemberDetails();
  },
  methods: {
    async resetPaymentSearch(){
      this.paymentSearchDialog.queryData = {
        year: null,
        month: null,
        day: null,
      };
      await this.loadPayments();
    },
    async getMemberDetails() {
      if (this.defaultMember) {
        this.stateRepMember = this.defaultMember;
        return;
      }

      await this.$doTask(async () => {
        const stateRepId = this.$nuxt.context.params.stateRepId;

        try {
          this.stateRepMember = await this.$axios.$get("/members/state_reps/" + stateRepId + '/details');

          console.log('state rep', this.stateRepMember);

          if(this.stateRepMember.id === undefined) {
            this.$vs.notification({
              title: 'Invalid State Rep ID!',
              position: 'top-right',
              color: 'warning',
              duration: 'none'
            });
          }
        } catch (e) {

        }


      }, 'Loading state rep dashboard...')
    },
    async loadOrders() {
      await this.$doTask(async () => {
        const stateRepId = this.member.state_rep_id;

        let response = await this.$axios.$get('/members/state_reps/' + stateRepId + '/orders', {
          params: {
            page: this.orders.page,
            ...this.orderSearchDialog.queryData
          }
        });

        this.orders.data = response.query.data;
        this.orders.totalPages = response.query.data.last_page;
        this.orders.totalPoints = response.total_points;

      }, 'Load state rep orders', this.$refs['details']);
    },
    async loadPayments() {
      await this.$doTask(async () => {
        const stateRepId = this.member.state_rep_id;

        let response = await this.$axios.$get('/members/state_reps/' + stateRepId + '/payments');

        this.payments.data = response.data;
        this.payments.totalPages = response.data.last_page;

      }, 'Load state rep payments', this.$refs['details']);
    },
    async resetOrderSearch(){
      this.orderSearchDialog.queryData = {
        year: null,
        month: null,
        day: null,
      };
      await this.loadOrders();
    }
  },
  computed: {
    member() {
      return this.stateRepMember;
    },
    username(){
      return this.member.user.username;
    },
    API_URL(){
      return this.$config.apiRoot;
    }
  },
  mounted() {
    this.$initXEditable();
  },
  watch: {
    'orders.page': function(page, __){
      this.loadOrders();
    },
  }
}
</script>

<style scoped lang="scss">

  .member-profile-photo {
    .change-photo-btn {
      visibility: hidden;
    }

    &:hover {
      .change-photo-btn {
        visibility: visible;
      }
    }
  }

</style>
