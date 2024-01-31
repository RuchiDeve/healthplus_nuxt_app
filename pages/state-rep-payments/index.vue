<template>

  <div class="row">
    <div class="col-12">
      <div class="row mt-2 mb-3">
        <div class="col-12 d-flex justify-content-between">
          <h3 class="display-4">State Reps. Payment Schedules</h3>

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
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card card-body" ref="supplies-list" style="min-height: 300px">
            <div class="d-flex grid-margin" v-if="pagination">
              <vs-pagination only-arrows v-model="page" :length="totalPages" />
              <span class="align-self-center badge badge-info">
                    Page: <b>{{ page }}</b>
                  </span>
            </div>
            <div class="table-responsive">
              <table class="table table-condensed table-hover">
                <thead>
                <tr>
                  <td></td>
                  <td>Member</td>
                  <td>Target start date</td>
                  <td>Target end date</td>
                  <td>Reached Point</td>
                  <td>Target Point</td>
                  <td>Total Orders</td>
                  <td>Status</td>
                  <td>Amount</td>
                  <td>Date Paid</td>
                  <td></td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(payment, index) in repPayments" :key="index"
                :class="{'text-warning': !payment.paid}">
                  <td>{{index + 1}}</td>
                  <td>
                    {{payment.member.full_name}}
                    <br>
                    ({{payment.member.user.username}})
                  </td>
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
                  <td class="font-weight-bold">{{payment.date_paid | date}}</td>
                  <td>
                    <vs-button primary flat size="small"
                               v-show="!payment.paid"
                               @click="markPaymentPrompt(payment)">
                      Pay
                    </vs-button>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="col-12 mt-4" v-if="totalPages">
          <vs-pagination v-model="page" :length="totalPages" />
        </div>
      </div>
    </div>

    <vs-dialog v-model="stateRepPaymentModal.show" auto-width
               @close="stateRepPaymentModal.show = false">
      <template #header>
        <div class="d-flex justify-content-between">
          <h4 class="">Make Payment</h4>
        </div>
      </template>

      <div class="row pt-5" v-if="selectedPayment && !selectedPayment.paid">
        <div class="col-md-12">
          <div class="form-group">
            <vs-input block label="Amount"
                      v-model="stateRepPaymentModal.amount"
                      aria-required="true" primary active type="number" />
          </div>
        </div>
        <div class="col-md-6">
          <vs-button block success active
                     @click="markPaid"
                     :disabled="!stateRepPaymentModal.amount">
            <i class="mdi mdi-check-circle"></i>
            Mark As Paid
          </vs-button>
        </div>
      </div>

    </vs-dialog>

    <vs-dialog blur :loading="paymentSearchDialog.loading" v-model="paymentSearchDialog.show" >
      <template #header>
        <h4 class="not-margin">
          <b>Search</b> payment...
        </h4>
      </template>

      <div class="con-form mt-3">
        <div class="form-group mb-5">
          <vs-input block label="Username" v-model.number="paymentSearchDialog.queryData.username"></vs-input>
        </div>

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
          <vs-button @click="getStateRepPayments" block>
            Search
          </vs-button>
        </div>
      </template>
    </vs-dialog>
  </div>

</template>

<script>
export default {
  name: "StateRepPaymentsIndex",
  layout: "app",
  data: () => ({
    page: 1,
    totalPages: 0,
    pagination: null,
    repPayments: [],
    selectedPayment: null,
    stateRepPaymentModal: {
      show: false,
      loading: false,
      amount: null,
    },
    paymentSearchDialog: {
      show: false,
      loading:false,
      queryData: {
        year: null,
        month: null,
        day: null,
        username: null,
      },
    },
  }),
  methods: {
    async resetPaymentSearch(){
      this.paymentSearchDialog.queryData = {
        year: null,
        month: null,
        day: null,
        username: null,
      };
      await this.getStateRepPayments();
    },
    async markPaymentPrompt(payment){
      this.selectedPayment = payment;
      this.stateRepPaymentModal.show = true;
    },
    async getStateRepPayments(){
      await this.$doTask(async () => {
        let response = await this.$axios.$get('state-rep-payments', {
          params: {
            page: this.page,
            ...this.paymentSearchDialog.queryData
          }
        });
        this.repPayments = response.data;
        this.totalPages = response.last_page;
      }, 'Fetching Payment schedules');
    },
    async markPaid(){
      await this.$doTask(async () => {
        await this.$axios.post('state-rep-payments/mark-paid', {
          id: this.selectedPayment.id,
          amount: this.stateRepPaymentModal.amount,
        });
        this.$vs.notification({
          title: 'Success',
          text: 'State Rep payment was successful.',
          color: 'success',
          position: 'top-center',
        });
      });
    },
  },
  mounted() {
    this.getStateRepPayments();
  },
  watch: {
    page(__, ___){
      this.getStateRepPayments();
    }
  }
}
</script>

<style scoped>

</style>
