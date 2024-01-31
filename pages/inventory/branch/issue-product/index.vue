<template>

  <div class="row" ref="branches-list">
    <div class="col-12">
      <div class="row mb-3">
        <div class="col-12 d-flex justify-content-between">
          <h3 class="display-4">
            <i class="bx bx-check-circle"></i>
            Issue Product To Stockist
          </h3>

        </div>
      </div>

      <div class="row mb-3">
        <div class="col-4">
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-body">
                  <div class="mb-3">
                    <vs-input block label="Request Pin:"
                              v-model="requestPin"></vs-input>
                  </div>

                  <button class="btn btn-sm btn-behance btn-block"
                          @click="findRequest"
                          :disabled="!requestPin.length">
                    <i class="mdi mdi-check-circle"></i>
                    Find Request
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="row" v-if="productRequest">
            <div class="col-12">
              <div class="card">
                <div class="card-body">
                  <vs-select block v-if="assignedBranches.length"
                             placeholder="Select an assigned branch..."
                             v-model="productBankList.branch_id">
                    <vs-option
                      label="Select an assigned branch..."
                      :value="-1">
                      Select an assigned branch...
                    </vs-option>
                    <vs-option
                      :key="index"
                      :label="branch.name"
                      v-for="(branch, index) in assignedBranches"
                      :value="branch.id">
                      {{ branch.name }}
                    </vs-option>
                  </vs-select>

                  <div class="mt-3" v-if="!productRequest.issued && productBankList.branch_id > 0">
                    <button class="btn btn-lg btn-success btn-block"
                            @click="issueProductRequest">
                      <i class="mdi mdi-check-circle"></i>
                      Issue Product(s)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-8" v-if="productRequest">
          <div class="row mb-3">
            <div class="col-lg-4">
              <div class="card card-body">
                <h5 class="card-title">Request Summary</h5>
                <div class="d-flex flex-row">
                  <div class="">
                    <h6 class="mb-2">
                      <div class="small text-muted">Request PIN:</div>
                      {{productRequest.request_pin}}
                    </h6>
                    <h6 class="">
                      <div class="small text-muted">Issued:</div>
                      <div v-if="productRequest.issued" class="text-success">
                        <i class="bx bx-check-circle"></i>
                        Issued
                      </div>
                      <div v-else class="text-warning">
                        NOT ISSUED
                      </div>
                    </h6>

                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-4">
              <div class="card card-body">
                <h5 class="card-title">Stockist's Info</h5>
                <div class="d-flex flex-row">
                  <div class="">
                    <h6 class="mb-2">
                      <div class="small text-muted">Name:</div>
                      {{productRequest.member.full_name}}
                    </h6>
                    <div class="">
                      <div class="small text-muted">Username::</div>
                      {{productRequest.member.user.username}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-body">
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
                          </tr>
                          </thead>
                          <tbody>
                          <tr v-for="(item, index) in productRequest.items" :key="index">
                            <td class="">{{index + 1}}</td>
                            <td class="">
                              {{item.product.name}}
                            </td>
                            <td class="text-center">
                              {{item.bottles | number}}
                            </td>
                          </tr>
                          </tbody>
                        </table>
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
  </div>

</template>

<script>
import {Permissions} from "~/utils/permissions";
import _ from "lodash";

export default {
  name: "new",
  layout: "app",
  data(){
    return {
      requestPin: '',
      productRequest: null,
      productBankList: {
        data: [],
        branch_id: -1,
      },
      assignedBranches: [],

    }
  },
  methods: {
    async issueProductRequest(){
      const loading = this.$vs.loading({
        text: 'Issuing Product. Please wait...'
      });

      try {
        let requestResponse = await this.$axios.$post("/inventory/branch/request/issue/stockist/", {
          "request_id": this.productRequest.id,
          "branch_id": this.productBankList.branch_id,
        });

        console.log('product request response', requestResponse);

        this.productRequest = requestResponse;

      } catch (e){
        console.log('error placing request', e.response);
      } finally {
        loading.close();
      }

    },
    async findRequest() {
      const loading = this.$vs.loading({
        text: 'Checking Request for Product. Please wait...'
      });

      try {
        let requestResponse = await this.$axios.$get("/inventory/branch/request/stockist/" + this.requestPin);

        console.log('product request response', requestResponse);

        this.productRequest = requestResponse;

      } catch (e){
        console.log('error placing request', e.response);
      } finally {
        loading.close();
      }

    },
    async fetchProductsInCountry(countryId) {
      let response = await this.$axios.get("/countries/" + countryId + "/products");

      this.products = response.data;

      console.log('products', this.products);
    },
    async fetchAssignedBranchForAuthUser(){
      this.assignedBranches = await this.$axios.$get('/branches/get-assigned-branch');
    },
    updateCart(quantity, product) {
      const index = _.findIndex(this.cartItems, {'product': product});

      if ((isNaN(quantity)) || (quantity < 1)) {
        // remove cart item
        if (index >= 0)
          this.cartItems.splice(index, 1);
        return;
      }

      if (index < 0) {
        // add to cart
        this.cartItems.push({
          'product': product,
          'quantity': quantity,
        });
      } else {
        // modify cart item quantity
        const cartItem = this.cartItems[index];
        cartItem.quantity = quantity;
      }
    },

  },
  computed: {
    searchData(){
      return this.search;
    },
    permissions(){
      return Permissions;
    },
    shouldResetSearchDialog(){
      var reset = false;

      for (const [key, value] of Object.entries(this.searchData)) {
        reset = !((value == null) || (value === ''));

        if(reset) break;
      }

      return reset;
    },

  },
  mounted() {
    this.fetchAssignedBranchForAuthUser();
  },
  watch: {

  }
}
</script>

<style scoped>

</style>
