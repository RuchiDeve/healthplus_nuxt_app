<template>

  <div class="row" ref="branches-list">
    <div class="col-12">
      <div class="row mb-3">
        <div class="col-12 d-flex justify-content-between">
          <h3 class="display-4">
            <i class="bx bx-plus"></i>
            New Product Requests
          </h3>

          <div class="">
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

      <div class="row mb-3">
        <div class="col-4">
          <div class="row">
            <div class="col-12">
              <div class="card">

                <div class="card-body">
                  <h5 class="card-title">Cart Summary</h5>
                </div>

                <div class="card-body pt-0 table-responsive" v-if="cartItems.length">
                  <table class="table table-hover table-condensed" style="table-layout: initial">
                    <thead class="thead-light">
                    <tr>
                      <th>Product</th>
                      <th>Qty (bottles)</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(cartItem, index) in cartItems" :key="index">
                      <td>{{cartItem.product.name}}</td>
                      <td>{{cartItem.quantity}}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>

                <div class="card-body pt-0" v-if="!cartItems.length">
                  <p class="text-warning text-center">
                    You cart is empty!
                  </p>
                </div>

                <hr class="my-0">

                <div class="card-body">
                  <button class="btn btn-lg btn-success btn-block"
                          @click="placeNewRequest"
                          :disabled="!cartItems.length">
                    <i class="mdi mdi-check-circle"></i>
                    Submit Request
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div class="col-8">
          <div class="card">
            <div class="card-body" style="max-height: 700px; overflow-y: auto">
              <h5 class="card-subtitle">Available Products</h5>
              <p class="card-text text-warning text-center" v-if="!products.length">
                No products found.
                Have you selected a branch?
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
      products: [],
      cartItems: [],
      productRequest: {
        assignedBranches: [],
        payload: {
          member_id : -1,
          items: []
        },
      },
    }
  },
  methods: {
    async placeNewRequest() {
      const loading = this.$vs.loading({
        text: 'Placing your request for products. Please wait...'
      });

      this.productRequest.payload.member_id = this.$root.authMember.id;

      this.productRequest.payload.items = _.map(this.cartItems, function (item) {
        return {
          "product_id": item.product.id,
          "bottles": item.quantity,
        };
      });

      try {
        let requestResponse = await this.$axios.$post("/inventory/stockist/request/save", this.productRequest.payload);

        console.log('product request response', requestResponse);

        await this.$router.push("/inventory/stockist/requests");

      } catch (e){
        console.log('error placing request', e.response);
      } finally {
        loading.close();
      }

    },
    async initAvailableProductsForStockist(){
      const country_id = this.$root.authMember.domain.country.id;
      await this.fetchProductsInCountry(country_id);
    },
    async fetchProductsInCountry(countryId) {

      let response = await this.$axios.get("/countries/" + countryId + "/products");

      this.products = response.data;

      console.log('products', this.products);
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
    this.initAvailableProductsForStockist();
  },
  watch: {

  }
}
</script>

<style scoped>

</style>
