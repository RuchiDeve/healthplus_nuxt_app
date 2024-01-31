<template>
  <div class="row" v-if="country">
    <div class="col-12">
      <div class="row mb-3">
        <div class="col-12">
          <div class="card card-body bg-transparent">
            <div class="d-flex justify-content-between">
              <div class="d-flex align-items-center">
                <div class="mr-2">
                  <vs-avatar class="d-inline-block" square size="70" dark>
                    <template #text v-if="!country.flag">
                      {{ country.name }}
                    </template>
                    <img :src="country.flag" v-if="country.flag" alt="">
                  </vs-avatar>
                </div>
                <div>
                  <p class="font-weight-bold m-0 p-0">Country Details</p>
                  <h4 class="display-4 mb-0">
                    {{ country.name }}
                  </h4>
                </div>
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

      <div class="row mb-3">
        <div class="col-md-3">
          <div class="card card-body">

            <div class="row" style="height: 441px; overflow-y: auto">
              <div class="col-12 grid-margin ">
                <p class="pb-0 mb-0">Name:</p>
                <h5 class="p-0 m-0">
                  {{country.name}}
                </h5>
              </div>

              <div class="col-12 grid-margin">
                <p class="pb-0 mb-0">Currency:</p>
                <h5 class="p-0 m-0">
                  {{country.currency.abbr}}
                  ({{country.currency.symbol}})
                </h5>
              </div>

              <div class="col-12 grid-margin">
                <p class="pb-0 mb-0">Registration:</p>
                <h5 class="p-0 m-0">
                  {{country.registration_cost | number}}
                </h5>
              </div>

              <div class="col-12 grid-margin">
                <p class="pb-0 mb-0">Matching Bonus:</p>
                <h5 class="p-0 m-0">
                  {{country.matching_bonus | number}}
                </h5>
              </div>

              <div class="col-12 grid-margin">
                <p class="pb-0 mb-0">Cost per point:</p>
                <h5 class="p-0 m-0">
                  {{country.amount_per_point | number}}
                </h5>
              </div>

              <div class="col-12 grid-margin">
                <p class="pb-0 mb-0">Coordinator's bonus per point:</p>
                <h5 class="p-0 m-0">
                  {{country.coordinator_bonus_per_point | number}}
                </h5>
              </div>

              <div class="col-12 grid-margin">
                <p class="pb-0 mb-0">Target CPt for State Reps.:</p>
                <h5 class="p-0 m-0">
                  {{country.state_rep_target_point | number}}
                </h5>
              </div>

              <div class="col-12 grid-margin">
                <p class="pb-0 mb-0">Stockist Bonus:</p>
                <h5 class="p-0 m-0">
                  {{country.stockist_bonus_per_bottle | number}}
                </h5>
              </div>
            </div>

            <div class="">
              <vs-button block warn @click="editCountry" size="small">
                <i class="bx bxs-edit"></i>
                Edit Data
              </vs-button>
              <country-modal :open="openCountryModal"
                             @country-updated="onCountryUpdated"
                             @close="openCountryModal = false"
                             :edit-country="country"></country-modal>
            </div>
          </div>
        </div>
        <div class="col-md-9" ref="allowed-products">
          <div class="card card-body">
            <div class="d-flex justify-content-between mb-3">
              <h5 class="card-subtitle">Allowed products in {{country.name}} ({{allowedProducts.length}})</h5>

              <div>
                <vs-button dark @click="manageCountryProducts" size="small">
                  <i class="bx bxs-edit"></i>
                  Manage Allowed Products
                </vs-button>
              </div>

            </div>

            <vs-dialog blur :loading="countryProductsModal.loading"
                       v-model="countryProductsModal.show"
                       @close="countryProductsModal.show = false">
              <template #header>
                <h4 class="not-margin">
                  Manage <b>Country Products</b>
                </h4>
              </template>

              <div class="con-form mt-3" style="min-height: 100px;" ref="all-products">

                <div v-for="(product, index) in allProducts" :key="index">
                  <vs-checkbox :val="product.id" v-model="countryProductsModal.selectedProducts">
                    {{product.name}}
                  </vs-checkbox>
                </div>

              </div>

              <template #footer>
                <div class="footer-dialog">
                  <vs-button @click="updateCountryProducts" :loading="countryProductsModal.loading"
                             :active-disabled="countryProductsModal.loading" block>
                    Submit
                  </vs-button>
                </div>
              </template>
            </vs-dialog>

            <div class="table-responsive" style="height: 425px; overflow-y: auto">
              <table class="table table-hover table-condensed table-hover">
                <thead>
                <tr>
                  <th>#</th>
                  <th></th>
                  <th>Name</th>
                  <th>Desc.</th>
                  <th>Bottles/Pt</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(productData, index) in allowedProducts" :key="index">
                  <td>{{index + 1}}</td>
                  <td>
                    <vs-avatar size="45">
                      <img :src="productData.product.image" style="object-fit: cover; object-position: center">
                    </vs-avatar>
                  </td>
                  <td>{{productData.product.name}}</td>
                  <td>{{productData.product.description}}</td>
                  <td>{{productData.product.units_per_point | number}}</td>

                </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-12">
          <stage-bonuses-list :country="country"></stage-bonuses-list>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-lg-6">
          <sponsorship-bonuses-list :country="country"></sponsorship-bonuses-list>
        </div>
        <div class="col-lg-6">
          <leadership-bonuses-list :country="country"></leadership-bonuses-list>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import _ from "lodash";
import StageBonusesList from "@/components/StageBonusesList";
import SponsorshipBonusesList from "@/components/SponsorshipBonusesList";
import ImageUploadInput from "~/components/inputs/ImageUploadInput";
import SelectCurrencyInput from "~/components/inputs/SelectCurrencyInput";
import LeadershipBonusesList from "~/components/LeadershipBonusesList";
import CountryModal from "~/components/country-modal";

export default {
  name: "country_details",
  components: {
    CountryModal,
    LeadershipBonusesList, SelectCurrencyInput, ImageUploadInput, SponsorshipBonusesList, StageBonusesList},
  layout: "app",
  data: () => ({
    country: null,
    allowedProducts: [],
    openCountryModal: false,
    shouldFetchCountryProducts: false,
    allProducts: [],
    countryProductsModal: {
      show: false,
      loading: false,
      selectedProducts: []
    },

  }),
  methods: {
    onCountryUpdated(country){
      this.country = country;
    },
    editCountry(){
      this.openCountryModal = true;
    },

    async getCountryDetails(){
      const slug = this.$nuxt.context.params.slug;

      let response;

      await this.$doTask(async () => {
        try {
          response = await this.$axios.get('countries/' +  slug + '/details');

          this.country = response.data;
          this.allowedProducts = this.country.products;

        } catch (e) {
          this.$vs.notification({
            color: 'danger',
            title: 'Invalid country',
            text: e.response.error,
            position: 'top-center'
          })
        }
      });
    },

    async getAllProducts(){
      if (this.allProducts.length) return;

      await this.$doTask(async ()=> {
        const response = await this.$axios.get('products');
        this.allProducts = response.data;
        this.loadSelectedProducts();
      }, 'Loading products...', this.$refs["all-products"]);

    },
    manageCountryProducts(){
      this.countryProductsModal.show = true;
      this.getAllProducts();
    },
    loadSelectedProducts(){
      this.allowedProducts.forEach((product) => {
        this.countryProductsModal.selectedProducts.push(product);
      })
    },
    async updateCountryProducts(){
      await this.$doTask(async () => {

        await this.$axios.post('countries/update/products', {
          country_id: this.country.id,
          product_ids: this.countryProductsModal.selectedProducts
        });
      });

      this.countryProductsModal.show = false;

      window.location.reload();
    }
  },
  mounted() {
    this.getCountryDetails();
  },
  watch: {
    shouldFetchCountryProducts(shouldFetch){
      if (shouldFetch){
        this.getCountryProducts();
      }
    }
  }
}
</script>

<style scoped>

</style>
