<template>

  <div class="row">
    <div class="col-12">
      <div class="row">
        <div class="col-12">
          <div class="card card-body px-0 bg-transparent">
            <div class="d-flex justify-content-between">
              <div class="">

              </div>
              <div class="float-right">
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
      </div>

      <div class="row">
        <div class="col-lg-8">
          <div class="card card-body">
            <form-wizard title="Place New Order"
                         subtitle="Complete your order in 3 easy steps"
                         step-size="sm" color="#E77E23">
              <tab-content title="Products" icon="ti-shopping-cart"
              :before-change="() => validateTab('productsTab')">
                <div class="card bg-transparent">
                  <h3 class="display-5 pl-4 pt-4 step-title">
                    <i class="bx bxs-shopping-bag"></i>
                    Products
                  </h3>

                  <div class="card-body py-4">
                    <div class="row">
                      <div class="col-md-6">
                        <select-country-input v-model="selectedCountry"></select-country-input>
                      </div>
                    </div>
                  </div>

                  <div class="card-body px-0" style="max-height: 300px; overflow-y: auto">
                    <h5 class="card-subtitle">Available Products</h5>
                    <p class="card-text text-warning text-center" v-if="!products.length">
                      No products found.
                      Have you selected a country?
                    </p>
                    <div class="py-4 px-4"
                         v-for="(product, index) in products" :key="index"
                    :class="{'bg-light': index % 2 === 0}">
                      <div class="row d-flex align-items-center">
                        <div class="col-md-9">
                          <div class="row d-flex align-items-center">
                            <div class="col-xs-3 mr-3">
                              <vs-avatar size="43" dark circle>
                                <img :src="product.image" alt="">
                              </vs-avatar>
                            </div>
                            <div class="col-xs-9 d-flex">
                              <h6 class="mb-0">{{product.name}}</h6>
                              <span class="badge badge-dark d-inline-block ml-3">
                                {{product.units_per_point + ' bottles = 1 Point'}}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-3 form-group">
                          <input type="number"
                                 @keyup="updateCart(parseInt($event.target.value), product)"
                                 @change="updateCart(parseInt($event.target.value), product)"
                                 min="0"
                                 placeholder="Quantity: "
                                 class="form-control form-control-sm border border-dark">
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </tab-content>

              <tab-content title="Buyer" icon="ti-user"
                           :before-change="() => validateTab('buyerTab')">
                <div class="card bg-transparent">
                  <h3 class="display-5 pl-4 pt-4 step-title">
                    <i class="ti-user"></i>
                    Buyer
                  </h3>

                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-6">
                        <div class="mb-2">
                          <vs-input :loading="isVerifyingBuyer" v-model="buyerUsername"
                                    type="search" block
                                    label-placeholder="Username of Buyer:" />
                        </div>

                        <member-info-card :this-member="buyerMember"></member-info-card>

                      </div>
                      <div class="col-md-6">

                      </div>
                    </div>

                  </div>
                </div>
              </tab-content>

              <tab-content title="Payment" icon="ti-money">
                <div class="card">
                  <h3 class="display-5 pl-4 pt-4 step-title">
                    <i class="ti-money"></i>
                    Payment
                  </h3>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-6">

                        <payment-channel-selector-input v-model="selectedPaymentChannel"></payment-channel-selector-input>

                        <div class="pt-4 mt-3" v-show="isWalletSelected">
                          <vs-input v-model.trim="walletPin"
                                    type="password" block
                                    label-placeholder="Wallet PIN:" />
                        </div>
                      </div>
                      <div class="col-md-6 border-left-md">
                        <div class="mb-4 pt-4">
                          <vs-input
                            v-model="paymentDate"
                            type="date" block
                            label="Date of Payment:"
                          />
                        </div>

                        <div class="mt-4" v-show="!isWalletSelected">
                          <vs-input
                            v-model.trim="paymentReference"
                            size="small" block
                            label="Payment Reference:"
                          />
                        </div>

                        <div class="" v-show="isWalletSelected">
                          <div class="pt-4 mb-2">
                            <vs-input :loading="isVerifyingPayer" v-model.trim="payerUsername"
                                      type="search" block
                                      label-placeholder="Username of Payer:" />
                          </div>

                          <member-info-card :this-member="payerMember"></member-info-card>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </tab-content>

              <template v-slot:next>
                <vs-button primary>
                  Continue
                  <i class="bx bxs-right-arrow"></i>
                </vs-button>
              </template>

              <template v-slot:prev>
                <vs-button warn border>
                  <i class="bx bxs-left-arrow"></i>
                  Back
                </vs-button>
              </template>

              <template v-slot:finish>
                <div></div>
              </template>
            </form-wizard>
          </div>
        </div>
        <div class="col-md-4">
          <div class="row mb-3" v-show="totalPoints > 0">
            <div class="col-12">
              <button class="btn btn-lg btn-success btn-block"
                      @click="placeNewOrder"
                      :disabled="totalPoints % 1 !== 0">
                <i class="mdi mdi-check-circle"></i>
                Checkout
              </button>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-12">
              <div class="card card-body pt-5">
                <vs-input :loading="stateRep.loading" v-model.trim="stateRep.id"
                          type="search" block
                          label="State Rep ID: (optional)" />

                <member-info-card :this-member="stateRep.data"></member-info-card>

              </div>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-12">
              <div class="card ">
                <div class="card-body pb-0">
                  <h5 class="">Order Summary</h5>
                </div>
                <div class="card-body" v-if="cartItems.length">

                  <p class="text-center mb-2">
                    Points Earned:
                    <span>{{totalPoints | number}}</span>
                  </p>
                  <p class="text-center font-weight-semibold mb-2">
                    Sub Total:
                    <span>
                      {{selectedCountry.currency.abbr}}
                      {{subTotal | number}}
                    </span>
                  </p>
                  <p class="text-center mb-2" v-if="registrationFee > 0">
                    Registration:
                    <span>
                        {{selectedCountry.currency.abbr}}
                        {{registrationFee | number}}
                      </span>
                  </p>

                  <h6 class="text-center mt-3 text-success">
                    Total :
                    <span>
                      {{selectedCountry.currency.abbr}}
                        {{total | number}}
                    </span>
                  </h6>

                </div>

                <div class="card-body pt-0" v-if="!cartItems.length">
                  <p class="text-warning text-center">
                    You cart is empty!
                  </p>
                </div>

              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-body pb-0">
                  <h5 class="card-title">Cart Summary</h5>
                </div>

                <div class="card-body pt-0 table-responsive" v-if="cartItems.length">
                  <table class="table table-hover table-condensed" style="table-layout: initial">
                    <thead class="thead-light">
                    <tr>
                      <th></th>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Points</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(cartItem, index) in cartItems" :key="index">
                      <td>
                        <vs-avatar size="30" circle>
                          <img :src="cartItem.product.image" alt="">
                        </vs-avatar>
                      </td>
                      <td>{{cartItem.product.name}}</td>
                      <td>{{cartItem.numberOfUnits}}</td>
                      <td>{{cartItem.points | number}}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>

                <div class="card-body pt-0" v-if="!cartItems.length">
                  <p class="text-warning text-center">
                    You cart is empty!
                  </p>
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
import SelectCountryInput from "@/components/inputs/SelectCountryInput";
import MemberInfoCard from "@/components/MemberInfoCard";
import _ from 'lodash';
import PaymentChannelSelectorInput from "@/components/inputs/PaymentChannelSelectorInput";
import {minLength, required, requiredIf} from "vuelidate/lib/validators";

export default {
  name: "new",
  components: {PaymentChannelSelectorInput, MemberInfoCard, SelectCountryInput},
  layout: "app",
  data(){
    return {
      notification: null,
      products: [],
      selectedCountry: null,
      paymentReference: null,
      walletPin: null,
      paymentDate: null,
      selectedPaymentChannel: null,
      cartItems: [],
      registrationFee: 0,
      buyerMember: null,
      payerMember: null,
      isVerifyingBuyer: false,
      isVerifyingPayer: false,
      buyerUsername: null,
      payerUsername: null,
      stateRep: {
        id: null,
        data: null,
        loading: false,
      },
    }
  },
  validations: {
    cartItems: {
      required,
      minLength: minLength(1)
    },
    buyerMember: {
      required,
    },
    payerMember: {
      required: requiredIf(function(data){
        return data.isWalletSelected;
      })
    },
    walletPin: {
      required: requiredIf(function(data){
        return data.isWalletSelected;
      })
    },
    paymentReference: {
      required: requiredIf(function (data){
        return !data.isWalletSelected;
      }),
      minLength: minLength(1),
    },
    paymentDate:{
      required,
    },
    selectedPaymentChannel: {
      required
    },
    productsTab: ['cartItems'],
    buyerTab: ['buyerMember'],
    paymentTab: ['selectedPaymentChannel', 'paymentReference', 'paymentDate', 'payerMember', 'walletPin'],
  },
  methods: {
    async fetchProductsInCountry(countryId) {
      let response = await this.$axios.get("/countries/" + countryId + "/products");

      this.products = response.data;
    },
    updateCart(quantity, product) {
      const index = _.findIndex(this.cartItems, {'product': product});

      if ((isNaN(quantity)) || (quantity < 1)) {
        // remove cart item
        if (index >= 0)
        this.cartItems.splice(index, 1);
        return;
      }

      const points = quantity / product.units_per_point;

      if (index < 0) {
        // add to cart
        this.cartItems.push({
          'product': product,
          'numberOfUnits': quantity,
          'points': points,
          'costPerUnit': this.selectedCountry.amount_per_point / product.units_per_point
        });
      } else {
        // modify cart item quantity
        const cartItem = this.cartItems[index];
        cartItem.numberOfUnits = quantity;
        cartItem.points = points;
      }
    },
    async verifyStateRepMember(stateRepId){
      this.stateRep.data = null;
      if (stateRepId === "") return;
      this.stateRep.loading = true;

      try {
        this.stateRep.data = await this.$axios.$post("/members/state_reps/check", {
          'state_rep_id': stateRepId,
        });

        if(this.stateRep.data.id === undefined) {
          this.stateRep.data = null;

          this.$vs.notification({
            title: 'Invalid State Rep ID!',
            position: 'top-right',
            color: 'warning'
          });
        }

      } catch (e) {

      } finally {
        this.stateRep.loading = false;
      }

    },
    async verifyMemberAsBuyer(username){
      this.buyerMember = null;
      if (username === "") return;
      this.isVerifyingBuyer = true;

      if (this.selectedCountry === null){
        alert('Select a country for this order to proceed.')
        this.isVerifyingBuyer = false;
        return ;
      }

      this.buyerMember = await this.$axios.$post("/members/check/member-info", {
        'memberUsername': username,
        'countryId': this.selectedCountry.id,
      });

      if(this.buyerMember === undefined) {
        this.$vs.notification({
          title: 'No member identified as buyer!',
          position: 'top-right',
          color: 'warning'
        });
      } else if (this.buyerMember.status === "inactive"){
        // buyer is inactive
        this.registrationFee = this.selectedCountry.registration_cost;
      }
      this.isVerifyingBuyer = false;
    },
    async verifyMemberAsPayer(username) {
      this.payerMember = null;
      if (username === "") return;
      this.isVerifyingPayer = true;

      if (this.selectedCountry === null){
        alert('Select a country for this order to proceed.')
        this.isVerifyingPayer = false;
        return ;
      }

      this.payerMember = await this.$axios.$post("/members/check/member-info", {
        'memberUsername': username,
        'countryId': this.selectedCountry.id,
      });

      if(!this.payerMember){
        this.$vs.notification({
          title: 'No member identified as payer!',
          position: 'top-right',
          color: 'danger'
        });
        return;
      }
      this.isVerifyingPayer = false;
    },
    async placeNewOrder(){
      if (!this.validateTab('buyerTab')) return;
      if (!this.validateTab('paymentTab')) return;

      const loading = this.$vs.loading({
        text: 'Placing your order. Please wait...'
      });

      const items = _.map(this.cartItems, function(item){
        return {
          "productId": item.product.id,
          "numberOfUnits": item.numberOfUnits,
          "pointsEarned": item.points,
          "costPerUnit": item.costPerUnit,
        };
      })

      if (this.isWalletSelected){
        let verifyFundsResponse = await this.verifyAvailableFunds(this.payerMember.user.username, this.total);
        if (!verifyFundsResponse.data.can_afford){
          this.$vs.notification({
            title: 'Insufficient Funds',
            text: 'The member identified as PAYER, do not have enough balance to cover this order.',
            color: 'danger',
            position: 'top-center',
          });
          loading.close();
          return ;
        }
        this.paymentReference = 'WALPAY/' + this.buyerMember.id + '/' + this.payerMember.id;
      } else {
        this.payerMember = this.buyerMember;
      }

      const order = {
        "paymentChannel": this.selectedPaymentChannel,
        "buyerMemberId": this.buyerMember.id,
        "payerMemberId": this.payerMember.id,
        "paymentReference": this.paymentReference,
        "paidAt": this.paymentDate,
        "orderItemDtoList": items,
        "countryId": this.selectedCountry.id,
        "registrationFee": this.registrationFee,
        "walletPin": this.walletPin,
      };

      if(this.stateRep.data){
        order.state_rep_id = this.stateRep.id;
      }

      try {
        let orderResponse = await this.$axios.$post("/orders/new", order);

        if (orderResponse.order_number === undefined){
          this.$vs.notification({
            title: 'Error, please try again!',
            text: 'Your order was not placed. You may have used a wrong PIN.',
            color: 'danger',
            position: 'top-center',
          });
        } else {
          this.$vs.notification({
            title: 'Success!',
            text: 'Your order has been made.',
            color: 'success',
            position: 'top-center',
          });
          loading.close();

          await this.$router.push("/orders/" + orderResponse.order_number + "/details");
        }
      } catch (e){
        console.log('error placing order', e.response);
      } finally {
        loading.close();
      }

    },
    async verifyAvailableFunds(username, amount){
      this.$vs.notification({
        title: 'Verifying available funds',
        color: 'primary',
      });
      return this.$axios.get('/members/'+ username + '/has-funds', {
        params: {
          amount: amount
        }
      })
    },
    validateTab(tab){
      this.$v[tab].$touch();
      return !this.$v[tab].$invalid;
    },
  },
  watch: {
    selectedCountry(country, __){
      this.fetchProductsInCountry(country.id);
    },
    buyerUsername: _.debounce(function(username){
      this.verifyMemberAsBuyer(username);
    }, 1500),
    payerUsername: _.debounce(function(username){
      this.verifyMemberAsPayer(username);
    }, 1500),
    'stateRep.id': _.debounce(function(state_rep_id){
      this.verifyStateRepMember(state_rep_id);
    }, 1500),

  },
  computed: {
    totalPoints() {
      let total = 0;
      this.cartItems.forEach(item => {
        total += item.points;
      });

      return total.toFixed(2);
    },
    subTotal() {
      let total = 0;
      this.cartItems.forEach(item => {
        total += item.points;
      });
      return this.selectedCountry.amount_per_point * total;
    },
    total() {
      return this.registrationFee + this.subTotal;
    },
    isWalletSelected(){
      return this.selectedPaymentChannel === 'Wallet';
    }
  },
  beforeMount() {
    const {defaultCountry, buyerMember, payerMember} = this.$nuxt.context.params;

    if (defaultCountry){
      this.selectedCountry = defaultCountry;
    }
    if (buyerMember){
      this.buyerUsername = buyerMember.user.username;
    }

    if (payerMember){
      this.payerUsername = payerMember.user.username;

      if (this.buyerUsername !== this.payerUsername){
        this.selectedPaymentChannel = 'Wallet';
      }
    }
  }
}
</script>

<style lang="scss">


</style>


