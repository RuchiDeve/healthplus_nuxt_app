<template>
  <div class="row" v-if="partner">
    <div class="col-12">
      <div class="row mt-3 mb-4">
        <div class="col-12 d-flex justify-content-between">
          <div class="d-flex align-items-center justify-content-start">
            <vs-button icon dark circle v-if="!$root.authPartner" @click="$router.back()">
              <i class="bx bxs-left-arrow-alt"></i>
            </vs-button>
            <h3 class="display-4">{{partner.fullName}} <span class="badge badge-success">PARTNER</span></h3>
          </div>
          <div>

          </div>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-5">
          <div class="card card-body">
            <div class="d-flex justify-content-between mb-3">
              <h5 class="card-subtitle mb-4">Partner's Details</h5>
              <div class="" v-if="!$root.authPartner">
                <vs-button size="small" warn block
                           @click="editPartner(partner)">
                  <i class="mdi mdi-content-save-edit"></i>
                  Edit Partner's Data
                </vs-button>
              </div>
            </div>

            <div class="row">
              <div class="col-sm-6 grid-margin ">
                <p class="pb-0 mb-0">First Name:</p>
                <h5 class="p-0 m-0">
                  {{partner.firstName}}
                </h5>
              </div>

              <div class="col-sm-6 grid-margin ">
                <p class="pb-0 mb-0">Last Name:</p>
                <h5 class="p-0 m-0">
                  {{partner.lastName}}
                </h5>
              </div>

              <div class="col-sm-6 grid-margin ">
                <p class="pb-0 mb-0">Phone:</p>
                <h5 class="p-0 m-0">
                  {{partner.phone}}
                </h5>
              </div>

              <div class="col-sm-12 grid-margin ">
                <p class="pb-0 mb-0">Email:</p>
                <h5 class="p-0 m-0">
                  {{partner.user.email}}
                </h5>
              </div>

              <div class="col-sm-12 grid-margin ">
                <p class="pb-0 mb-0">Address:</p>
                <h5 class="p-0 m-0">
                  {{partner.address}}
                </h5>
              </div>

              <div class="col-sm-6 grid-margin ">
                <p class="pb-0 mb-0">Account Number:</p>
                <h5 class="p-0 m-0">
                  {{partner.accountNumber}}
                </h5>
              </div>

              <div class="col-sm-6 grid-margin ">
                <p class="pb-0 mb-0">Bank:</p>
                <h5 class="p-0 m-0">
                  {{partner.bank}}
                </h5>
              </div>

            </div>

          </div>

          <vs-dialog blur not-padding auto-width :loading="partnerModal.loading"
                     v-model="partnerModal.show"  v-if="!$root.authPartner"
                     @close="partnerModal.show = false">
            <partner-form
              :default-partner="partnerModal.selectedPartner"
              @loading="loading => partnerModal.loading = loading"
              @saved="onPartnerSaved($event)"></partner-form>
          </vs-dialog>

        </div>

        <div class="col-md-7" ref="allowed-products">
          <div class="card card-body">
            <div class="d-flex justify-content-between mb-3">
              <h5 class="card-subtitle">Allowed products for {{partner.firstName}} ({{allowedProducts.length}})</h5>
              <div v-if="!$root.authPartner">
                <vs-button dark @click="managePartnerProducts" size="small">
                  <i class="bx bxs-edit"></i>
                  Manage Allowed Products
                </vs-button>
              </div>

            </div>

            <vs-dialog blur :loading="partnerProductsModal.loading"
                       v-model="partnerProductsModal.show" v-if="!$root.authPartner"
                       @close="closePartnerProductManager">
              <template #header>
                <h4 class="not-margin">
                  Manage <b>Partner's Products</b>
                </h4>
              </template>

              <div class="con-form mt-3 d-flex flex-column justify-content-between align-items-start"
                   v-if="!partnerProductsModal.partnerProductId"
                   style="height: 155px; overflow-y: auto" ref="all-products">
                <h5 class="text-info">Choose a product</h5>
                <div v-for="(product, index) in availableProducts" class="mb-2" :key="product.id">
                  <vs-radio :val="product" v-model="partnerProductsModal.selectedProduct">
                    {{product.name}}
                  </vs-radio>
                </div>
              </div>
              <p class="my-3" v-if="partnerProductsModal.selectedProduct">
                Selected Product
                <span class="font-weight-bold">
                  <i class="bx bxs-check-circle"></i>
                {{partnerProductsModal.selectedProduct.name}}
                </span>
              </p>

              <hr>

              <div class="pt-3">
                <div class="form-group">
                  <vs-input block label="Commission" type="number"
                            v-model.number="partnerProductsModal.commission"></vs-input>
                </div>
              </div>

              <template #footer>
                <div class="footer-dialog">
                  <vs-button @click="updatePartnerProducts" :loading="partnerProductsModal.loading"
                             :active-disabled="partnerProductsModal.loading" block>
                    Submit
                  </vs-button>
                </div>
              </template>
            </vs-dialog>

            <div class="table-responsive" style="height: 328px; overflow-y: auto">
              <table class="table table-hover table-condensed table-hover">
                <thead>
                <tr>
                  <th>#</th>
                  <th></th>
                  <th>Product</th>
                  <th>Commission</th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in allowedProducts" :key="index">
                  <td>{{index + 1}}</td>
                  <td>
                    <vs-avatar size="45">
                      <img :src="item.product.image" style="object-fit: cover; object-position: center">
                    </vs-avatar>
                  </td>
                  <td>{{item.product.name}}</td>
                  <td>{{item.commission | money}} per Bottle</td>
                  <td>
                    <vs-button primary flat v-if="!$root.authPartner"
                               @click="updatePartnerProduct(item)">
                      <i class="bx bxs-edit"></i>
                      edit
                    </vs-button>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-3 grid-margin">
          <div class="card card-body" ref="earnings">
            <div class="d-flex flex-column">
              <p class="card-text font-weight-bold mb-0" style="white-space: nowrap">
                Current Earnings
              </p>
              <div class="fluid-container">
                <h3 class="card-title text-success mb-0">
                  <i class="mdi mdi-currency-ngn"></i>
                  {{ paymentBalance | money }}
                </h3>
              </div>

            </div>
          </div>
        </div>
        <div class="col-md-3 grid-margin">
          <div class="card card-body" ref="products-sold">
            <div class="d-flex flex-column">
              <p class="card-text font-weight-bold mb-0" style="white-space: nowrap">
                Products Sold
              </p>
              <div class="fluid-container">
                <h3 class="card-title text-success mb-0">
                  <i class="mdi mdi-account"></i>
                  {{ totalProductsSold | number }}
                </h3>
              </div>

            </div>
          </div>
        </div>
        <div class="col-12 grid-margin">
          <div class="card card-body">
            <div class="d-flex justify-content-between">
              <h5 class="card-subtitle">My Payments</h5>
              <div>
                <vs-button success v-if="!$root.authPartner"
                           @click="partnerPaymentsModal.show = true">
                  <i class="mdi mdi-cash"></i>
                  Pay Partner's Earnings
                </vs-button>
                <vs-dialog blur :loading="partnerPaymentsModal.loading"
                           v-model="partnerPaymentsModal.show" v-if="!$root.authPartner"
                           @close="partnerPaymentsModal.show = false">
                  <template #header>
                    <h4 class="">Make New Payment</h4>
                  </template>

                  <div class="">
                    <div class="form-group mb-3">
                      <vs-input block label="Amount" type="number"
                                :max="paymentBalance"
                                v-model.number="partnerPaymentsModal.payload.amount"></vs-input>
                    </div>
                    <div class="form-group pt-4 mb-3">
                      <vs-input block label="Paid At" type="date"
                      v-model="partnerPaymentsModal.payload.paidAt"></vs-input>
                    </div>

                    <div class="form-group">
                      <vs-checkbox v-model="partnerPaymentsModal.payload.confirmed">
                        I confirm that this payment has been made to the partner.
                      </vs-checkbox>
                    </div>
                  </div>

                  <template #footer>
                    <div>
                      <vs-button block success @click="savePayment"
                                 :disabled="!partnerPaymentsModal.payload.confirmed || !partnerPaymentsModal.payload.amount || (partnerPaymentsModal.payload.amount > paymentBalance)">
                        <i class="ti-check"></i>
                        Save
                      </vs-button>
                    </div>
                  </template>

                </vs-dialog>
              </div>
            </div>

            <div class="table-responsive" ref="payments" style="height: 350px; overflow-y: auto;">
              <table class="table table-condensed table-hover">
                <thead>
                <tr>
                  <th></th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Balance</th>
                  <th>Date Paid</th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(payment, index) in payments" :key="payment.id">
                  <td>{{index + 1}}</td>
                  <td>{{payment.createdAt | date}}</td>
                  <td>{{payment.amount | money}}</td>
                  <td>{{payment.balance | money}}</td>
                  <td>{{payment.paidAt | date}}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import PartnerForm from "@/components/PartnerForm";
export default {
  name: "PartnerDetails",
  components: {PartnerForm},
  layout: "app",
  data: () => ({
    partner: null,
    paymentBalance: 0,
    totalProductsSold: 0,
    allowedProducts: [],
    shouldFetchPartnerProducts: false,
    shouldFetchPayments: false,
    allProducts: [],
    payments: [],
    partnerProductsModal: {
      show: false,
      loading: false,
      selectedProduct: null,
      commission: 0,
      partnerProductId: null,
    },
    partnerModal: {
      show: false,
      loading: false,
      selectedPartner: null,
    },
    partnerPaymentsModal: {
      show: false,
      loading: false,
      payload: {
        amount: 0,
        paidAt: null,
        confirmed: false,
      }
    },
  }),
  props: {
    defaultPartner: {
      required: false,
      type: Object
    }
  },
  methods: {
    editPartner(partner){
      this.partnerModal.selectedPartner = partner;
      this.partnerModal.show = true;
    },
    onPartnerSaved(partner){
      this.partnerModal.show = false;
      this.partnerModal.loading = false;
      this.getDetails();
    },
    closePartnerProductManager(){
      this.partnerProductsModal.show = false
      this.partnerProductsModal.selectedProduct = null;
      this.partnerProductsModal.partnerProductId = null;
      this.partnerProductsModal.commission = 0;
    },
    async updatePartnerProduct(partnerProduct){
      await this.getAllProducts();
      this.partnerProductsModal.selectedProduct = partnerProduct.product;
      this.partnerProductsModal.commission = partnerProduct.commission;
      this.partnerProductsModal.partnerProductId = partnerProduct.id;
      this.partnerProductsModal.show = true;
    },
    async getDetails(){
      const id = this.$nuxt.context.params.id;

      if (this.defaultPartner) {
        this.partner = this.defaultPartner;
        return;
      }

      await this.$doTask(async () => {
        const response = await this.$axios.get('partners/' + id + '/details');
        this.partner = response.data;
      }, 'Connecting...');
    },
    async getPartnerProducts(){
      let id = this.$nuxt.context.params.id;
      this.shouldFetchCountryProducts = false;

      if (this.defaultPartner){
        id = this.defaultPartner.id;
      }

      await this.$doTask(async () => {
        let response = await this.$axios.get('partners/' + id + '/products');
        this.allowedProducts = response.data;
      }, 'Loading...', this.$refs["allowed-products"]);
    },
    async getAllProducts(){
      if (this.allProducts.length) return;

      await this.$doTask(async ()=> {
        const response = await this.$axios.get('products');
        this.allProducts = response.data;
      }, 'Loading products...', this.$refs["all-products"]);
    },
    managePartnerProducts(){
      this.partnerProductsModal.show = true;
      this.getAllProducts();
    },
    async updatePartnerProducts(){
      this.shouldFetchPartnerProducts = false;

      await this.$doTask(async () => {

        await this.$axios.post('partners/products', {
          partnerId: this.partner.id,
          productId: this.partnerProductsModal.selectedProduct.id,
          commission: this.partnerProductsModal.commission,
          partnerProductId: this.partnerProductsModal.partnerProductId
        });
      });

      this.partnerProductsModal.show = false;
      this.shouldFetchPartnerProducts = true;
    },
    resetPaymentForm(){
      this.partnerPaymentsModal.loading = false;
      this.partnerPaymentsModal.show = false;
    },
    async getPayments(){
      this.shouldFetchPayments = false;
      let id = this.$nuxt.context.params.id;

      if (this.defaultPartner){
        id = this.defaultPartner.id;
      }

      await this.$doTask(async () => {
        let response = await this.$axios.get('partners/' + id + '/payments');
        this.payments = response.data;
      }, 'Loading...', this.$refs.payments);
    },
    async savePayment(){
      let id = this.$nuxt.context.params.id;
      this.partnerPaymentsModal.loading = true;

      if (this.defaultPartner){
        id = this.defaultPartner.id;
      }

      await this.$doTask(async () => {
        let response = await this.$axios.post('partners/' + id + '/payments/save',
          this.partnerPaymentsModal.payload
        );
        if (response.data.id){
          this.$vs.notification({
            color: 'success',
            position: 'top-center',
            title: 'Great!',
            text: 'Partner has been paid.'
          });
          this.resetPaymentForm();
          window.location.reload();
        }
      });

      this.partnerPaymentsModal.loading = false;
    },
    async getPaymentBalance(){
      this.shouldFetchPayments = false;
      let id = this.$nuxt.context.params.id;

      if (this.defaultPartner){
        id = this.defaultPartner.id;
      }

      await this.$doTask(async () => {
        let response = await this.$axios.get('partners/' + id + '/payments/balance');
        this.paymentBalance = response.data;
      }, 'Loading...', this.$refs.earnings);
    },
    async getTotalProductsSold(){
      this.shouldFetchPayments = false;
      let id = this.$nuxt.context.params.id;

      if (this.defaultPartner){
        id = this.defaultPartner.id;
      }

      await this.$doTask(async () => {
        let response = await this.$axios.get('partners/' + id + '/products/total-sold');
        this.totalProductsSold = response.data;
      }, 'Loading...', this.$refs["products-sold"]);
    },
  },
  async mounted() {
    await this.getDetails();
    await this.getPartnerProducts();
    await this.getPayments();
    await this.getPaymentBalance();
    await this.getTotalProductsSold();
    console.log('partners dashboard loaded');
  },
  watch: {
    shouldFetchPartnerProducts(shouldFetch){
      if (shouldFetch){
        this.getPartnerProducts();
      }
    },
    shouldFetchPayments(shouldFetch){
      if (shouldFetch){
        this.getPayments();
      }
    }
  },
  computed: {
    availableProducts(){
      const vm = this;
      return _.filter(this.allProducts, function(p) {
        return !_.find(vm.allowedProducts, function(partnerProduct){
          return partnerProduct.product.id === p.id;
        });
      })
    }
  }
}
</script>

<style scoped>

</style>
