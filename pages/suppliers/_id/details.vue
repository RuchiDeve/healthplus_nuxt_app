<template>
  <div class="row" v-if="supplier">
    <div class="col-12">
      <div class="row mt-3 mb-4">
        <div class="col-12 d-flex justify-content-between">
          <div class="d-flex align-items-center justify-content-start">
            <vs-button icon dark circle v-if="!$root.authSupplier" @click="$router.back()">
              <i class="bx bxs-left-arrow-alt"></i>
            </vs-button>
            <h3 class="display-4">{{supplier.fullName}} <span class="badge badge-dark">SUPPLIER</span></h3>
          </div>
          <div>
            <vs-button square success active v-if="!$root.authSupplier" @click="supplyItemsModal.show = true">
              <i class="bx bxs-cart-add"></i>
              New Supply
            </vs-button>
            <vs-dialog blur v-if="!$root.authSupplier" :loading="supplyItemsModal.loading"
                       v-model="supplyItemsModal.show"
                       @close="supplyItemsModal.show = false">
              <template #header>
                <h4 class="">Make New Supply</h4>
              </template>

              <div class="mt-3" style="max-height: 200px; overflow-y: auto">
                <div class="py-2 px-3"
                     v-for="(item, index) in allowedProducts" :key="index"
                     :class="{'bg-light': index % 2 === 0}">
                  <div class="row d-flex align-items-center">
                    <div class="col-md-8">
                      <div class="row d-flex align-items-center">
                        <div class="col-xs-3 mr-1">
                          <vs-avatar size="35" dark square>
                            <img :src="item.product.image" style="object-fit: cover; object-position: center">
                          </vs-avatar>
                        </div>
                        <div class="col-xs-9 d-flex">
                          <h6 class="mb-0">{{item.product.name}}</h6>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4 form-group align-self-center">
                      <input type="number"
                             @keyup="updateSupply(parseInt($event.target.value), item)"
                             @change="updateSupply(parseInt($event.target.value), item)"
                             min="0"
                             placeholder="Quantity: "
                             class="form-control form-control-sm border border-dark">
                    </div>
                  </div>
                </div>
              </div>

              <template #footer v-if="supplyItemsModal.payload.supplyItems.length">

                <div>
                  <vs-button success block @click="saveSupply">
                    Submit
                  </vs-button>
                </div>

              </template>
            </vs-dialog>
          </div>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-4">
          <div class="card card-body">
            <h5 class="card-subtitle mb-4">Supplier's Details</h5>

            <div class="row">
              <div class="col-sm-6 grid-margin ">
                <p class="pb-0 mb-0">First Name:</p>
                <h5 class="p-0 m-0">
                  {{supplier.firstName}}
                </h5>
              </div>

              <div class="col-sm-6 grid-margin ">
                <p class="pb-0 mb-0">Last Name:</p>
                <h5 class="p-0 m-0">
                  {{supplier.lastName}}
                </h5>
              </div>

              <div class="col-sm-6 grid-margin ">
                <p class="pb-0 mb-0">Phone:</p>
                <h5 class="p-0 m-0">
                  {{supplier.phone}}
                </h5>
              </div>

              <div class="col-sm-6 grid-margin ">
                <p class="pb-0 mb-0">Username:</p>
                <h5 class="p-0 m-0">
                  {{supplier.username}}
                </h5>
              </div>

              <div class="col-sm-12 grid-margin ">
                <p class="pb-0 mb-0">Email:</p>
                <h5 class="p-0 m-0">
                  {{supplier.user.email}}
                </h5>
              </div>

              <div class="col-sm-12 grid-margin ">
                <p class="pb-0 mb-0">Address:</p>
                <h5 class="p-0 m-0">
                  {{supplier.address}}
                </h5>
              </div>

              <div class="col-sm-6 grid-margin ">
                <p class="pb-0 mb-0">Account Number:</p>
                <h5 class="p-0 m-0">
                  {{supplier.accountNumber}}
                </h5>
              </div>

              <div class="col-sm-6 grid-margin ">
                <p class="pb-0 mb-0">Bank:</p>
                <h5 class="p-0 m-0">
                  {{supplier.bank}}
                </h5>
              </div>

            </div>

            <div class="row">
              <div class="col-12">
                <vs-button size="small" warn block
                           @click="editSupplier(supplier)">
                  <i class="mdi mdi-content-save-edit"></i>
                  Edit Supplier's Data
                </vs-button>
              </div>
            </div>
          </div>

          <vs-dialog blur not-padding auto-width :loading="supplierModal.loading"
                     v-model="supplierModal.show"
                     @close="supplierModal.show = false">
            <supplier-form
              :default-supplier="supplierModal.selectedSupplier"
              @loading="loading => supplierModal.loading = loading"
              @saved="onSupplierSaved($event)"></supplier-form>
          </vs-dialog>

        </div>

        <div class="col-md-8" ref="allowed-products">
          <div class="card card-body">
            <div class="d-flex justify-content-between mb-3">
              <h5 class="card-subtitle">Allowed products for {{supplier.firstName}} ({{allowedProducts.length}})</h5>
              <div>
                <vs-button dark v-if="!$root.authSupplier" @click="manageSupplierProducts" size="small">
                  <i class="bx bxs-edit"></i>
                  Manage Allowed Products
                </vs-button>
              </div>

            </div>

            <vs-dialog blur v-if="!$root.authSupplier" :loading="supplierProductsModal.loading"
                       v-model="supplierProductsModal.show"
                       @close="closeSupplierProductManager">
              <template #header>
                <h4 class="not-margin">
                  Manage <b>Supplier's Products</b>
                </h4>
              </template>

              <div class="con-form mt-3 d-flex flex-column justify-content-between align-items-start"
                   v-if="!supplierProductsModal.supplierProductId"
                   style="height: 155px; overflow-y: auto" ref="all-products">
                <h5 class="text-info">Choose a product</h5>
                <div v-for="(product, index) in availableProducts" class="mb-2" :key="product.id">
                  <vs-radio :val="product" v-model="supplierProductsModal.selectedProduct">
                    {{product.name}}
                  </vs-radio>
                </div>
              </div>
              <p class="my-3" v-if="supplierProductsModal.selectedProduct">
                Selected Product
                <span class="font-weight-bold">
                  <i class="bx bxs-check-circle"></i>
                {{supplierProductsModal.selectedProduct.name}}
                </span>
              </p>

              <hr>

              <div class="pt-3">
                <div class="form-group">
                  <vs-input block label="Commission" type="number"
                            v-model.number="supplierProductsModal.commission"></vs-input>
                </div>
              </div>

              <template #footer>
                <div class="footer-dialog">
                  <vs-button @click="updateSupplierProducts" :loading="supplierProductsModal.loading"
                             :active-disabled="supplierProductsModal.loading" block>
                    Submit
                  </vs-button>
                </div>
              </template>
            </vs-dialog>

            <div class="table-responsive" style="height: 350px; overflow-y: auto">
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
                    <vs-button primary v-if="!$root.authSupplier" @click="updateSupplierProduct(item)">
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
                  {{ totalEarnings | money }}
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
            <h5 class="card-subtitle">My Supplies</h5>
            <div class="table-responsive" ref="supplies" style="height: 350px; overflow-y: auto;">
              <table class="table table-condensed table-hover">
                <thead>
                <tr>
                  <th></th>
                  <th>Date</th>
                  <th>Commission Earned</th>
                  <th>Products</th>
                  <th>Status</th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(supply, index) in supplies" :key="supply.id">
                  <td>{{index + 1}}</td>
                  <td>{{supply.createdAt | date}}</td>
                  <td>{{supply.totalCommission | number}}</td>
                  <td>{{supply.supplyItems.length}}</td>
                  <td>
                    <span class="badge badge-success" v-if="supply.confirmed">
                      <i class="bx bxs-check-circle"></i>
                      CONFIRMED, PAID
                    </span>
                    <span class="badge badge-warning" v-else>
                      <i class="bx bxs-error"></i>
                      PENDING
                    </span>
                  </td>
                  <td>
                    <vs-button flat primary square size="small"
                               v-if="!$root.authSupplier"
                    @click="viewSupplyDetails(supply)">
                      <i class="bx bxs-detail"></i>
                      details
                    </vs-button>

                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <vs-dialog v-model="supplyDetailsModal.show" v-if="!$root.authSupplier"
                 @close="supplyDetailsModal.show = false">
        <template #header>
          <h4 class="">Supply Details</h4>
        </template>

        <div class="mt-3 table-responsive" style="max-height: 300px; overflow-y: auto">
          <table class="table table-condensed" v-if="supplyDetailsModal.data">
            <thead>
            <tr>
              <th></th>
              <th>Product</th>
              <th>Quantity</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in supplyDetailsModal.data.supplyItems" :key="index">
              <td>{{index + 1}}</td>
              <td>{{item.supplierProduct.product.name}}</td>
              <td>{{item.quantity | number}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </vs-dialog>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import SupplierForm from "@/components/SupplierForm";
export default {
  name: "SupplierDetails",
  components: {SupplierForm},
  layout: "app",
  data: () => ({
    supplier: null,
    allowedProducts: [],
    shouldFetchSupplierProducts: false,
    shouldFetchSupplies: false,
    allProducts: [],
    supplies: [],
    supplierProductsModal: {
      show: false,
      loading: false,
      selectedProduct: null,
      commission: 0,
      supplierProductId: null,
    },
    supplierModal: {
      show: false,
      loading: false,
      selectedSupplier: null,
    },
    supplyItemsModal: {
      show: false,
      loading: false,
      payload: {
        supplyItems: [],
      }
    },
    supplyDetailsModal: {
      show: false,
      data: null
    }
  }),
  props: {
    defaultSupplier: {
      required: false,
      type: Object
    }
  },
  methods: {
    editSupplier(supplier){
      this.supplierModal.selectedSupplier = supplier;
      this.supplierModal.show = true;
    },
    onSupplierSaved(supplier){
      this.supplierModal.show = false;
      this.supplierModal.loading = false;
      this.getDetails();
    },
    closeSupplierProductManager(){
      this.supplierProductsModal.show = false
      this.supplierProductsModal.selectedProduct = null;
      this.supplierProductsModal.supplierProductId = null;
      this.supplierProductsModal.commission = 0;
    },
    async updateSupplierProduct(supplierProduct){
      await this.getAllProducts();
      this.supplierProductsModal.selectedProduct = supplierProduct.product;
      this.supplierProductsModal.commission = supplierProduct.commission;
      this.supplierProductsModal.supplierProductId = supplierProduct.id;
      this.supplierProductsModal.show = true;
    },
    async getDetails(){
      const id = this.$nuxt.context.params.id;

      if (this.defaultSupplier) {
        this.supplier = this.defaultSupplier;
        return;
      }

      await this.$doTask(async () => {
        const response = await this.$axios.get('suppliers/' + id + '/details');
        this.supplier = response.data;
      }, 'Connecting...');
    },
    async getSupplierProducts(){
      let id = this.$nuxt.context.params.id;
      this.shouldFetchCountryProducts = false;

      if (this.defaultSupplier) {
        id = this.defaultSupplier.id;
      }

      await this.$doTask(async () => {
        let response = await this.$axios.get('suppliers/' + id + '/products');
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
    manageSupplierProducts(){
      this.supplierProductsModal.show = true;
      this.getAllProducts();
    },
    async updateSupplierProducts(){
      this.shouldFetchSupplierProducts = false;

      await this.$doTask(async () => {

        await this.$axios.post('suppliers/products', {
          supplierId: this.supplier.id,
          productId: this.supplierProductsModal.selectedProduct.id,
          commission: this.supplierProductsModal.commission,
          supplierProductId: this.supplierProductsModal.supplierProductId
        });
      });

      this.supplierProductsModal.show = false;
      this.shouldFetchSupplierProducts = true;
    },
    updateSupply(quantity, supplyProduct){
      const index = _.findIndex(this.supplyItemsModal.payload.supplyItems,
        {'supplierProductId': supplyProduct.id});

      if ((isNaN(quantity)) || (quantity < 1)) {
        // remove cart item
        if (index >= 0)
          this.supplyItemsModal.payload.supplyItems.splice(index, 1);
        return;
      }

      let totalCommission = supplyProduct.commission * quantity;

      if (index < 0) {
        // add to cart
        this.supplyItemsModal.payload.supplyItems.push({
          'supplierProductId': supplyProduct.id,
          'quantity': quantity,
          'totalCommission': totalCommission,
        });
      } else {
        // modify cart item quantity
        const item = this.supplyItemsModal.payload.supplyItems[index];
        item.quantity = quantity;
        item.totalCommission = totalCommission;
      }
    },
    async saveSupply(){
      this.supplyItemsModal.loading = true;
      const supplyId = this.$nuxt.context.params.id;

      await this.$axios.post('supply/' + supplyId + '/new',
          this.supplyItemsModal.payload.supplyItems);

      this.shouldFetchSupplies = true;

      this.resetSupplyForm();
    },
    resetSupplyForm(){
      this.supplyItemsModal.payload.supplyItems = [];
      this.supplyItemsModal.loading = false;
      this.supplyItemsModal.show = false;
    },
    async getSupplies(){
      this.shouldFetchSupplies = false;
      let id = this.$nuxt.context.params.id;

      if (this.defaultSupplier) {
        id = this.defaultSupplier.id;
      }

      await this.$doTask(async () => {
        let response = await this.$axios.get('suppliers/' + id + '/supplies');
        this.supplies = response.data;
      }, 'Loading...', this.$refs.supplies);
    },
    viewSupplyDetails(supply){
      this.supplyDetailsModal.data = supply;
      this.supplyDetailsModal.show = true;
    }
  },
  async mounted() {
    await this.getDetails();
    await this.getSupplierProducts();
    await this.getSupplies();
  },
  watch: {
    shouldFetchSupplierProducts(shouldFetch){
      if (shouldFetch){
        this.getSupplierProducts();
      }
    },
    shouldFetchSupplies(shouldFetch){
      if (shouldFetch){
        this.getSupplies();
      }
    }
  },
  computed: {
    availableProducts(){
      const vm = this;
      return _.filter(this.allProducts, function(p) {
        return !_.find(vm.allowedProducts, function(supplierProduct){
          return supplierProduct.product.id === p.id;
        });
      })
    },
    totalProductsSold(){
      return _.sumBy(this.supplies, function(item){
        return item.supplyItems.length;
      });
    },
    totalEarnings(){
      return _.sumBy(this.supplies, function(item){
        if (item.confirmed) return item.totalCommission;
        return 0;
      });
    }
  }
}
</script>

<style scoped>

</style>
