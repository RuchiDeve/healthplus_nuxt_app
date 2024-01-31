<template>

  <div class="row">
    <div class="col-12">
      <div class="d-flex justify-content-between mt-5 mb-3">
        <h4 class="display-4">Countries</h4>
        <div>
          <button class="btn btn-primary" @click="newCountry">
            <i class="bx bxs-plus-circle"></i>
            Add Country
          </button>

        </div>
      </div>
      <div class="table-responsive card card-body">
        <table class="table table-hover table-condensed table-hover">
          <thead>
          <tr>
            <th>#</th>
            <th></th>
            <th>Name</th>
            <th>Currency</th>
            <th>Reg. Cost</th>
            <th>Stockist<br>Bonus</th>
            <th>Coordinator's<br>Bonus</th>
            <th>Matching Bonus</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(country, index) in countries" :key="index">
            <td>{{index + 1}}</td>
            <td>
              <vs-avatar size="45">
                <img :src="country.flag" style="object-fit: cover; object-position: center">
              </vs-avatar>
            </td>
            <td>{{country.name}}</td>
            <td>{{country.currency.abbr}}</td>
            <td>{{country.registration_cost | number}}</td>
            <td>{{country.stockist_bonus_per_bottle | number}}</td>
            <td>{{country.coordinator_bonus_per_point | number}}</td>
            <td>{{country.matching_bonus | number}}</td>
            <td>
              <div class="d-flex">
                <vs-button border dark @click="editCountry(country)" size="small">
                  <i class="bx bxs-edit"></i>
                  Edit
                </vs-button>
                <vs-button primary size="small" @click="$router.push('/countries/' + country.slug + '/details')">
                  <i class="bx bxs-detail"></i>
                  view details
                </vs-button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <country-modal :open="openCountryModal"
                   @country-updated="updateCountry"
                   @close="openCountryModal = false"
                   :edit-country="editCountryData"></country-modal>
  </div>

</template>

<script>
import ImageUploadInput from "@/components/inputs/ImageUploadInput";
import SelectCurrencyInput from "@/components/inputs/SelectCurrencyInput";
import CountryModal from "~/components/country-modal";
export default {
  name: "index",
  components: {CountryModal, SelectCurrencyInput, ImageUploadInput},
  layout: "app",
  data(){
    return {
      countries: [],
      openCountryModal: false,
      editCountryData: null,
    }
  },
  async fetch(){
    await this.getCountries();
  },
  methods: {
    async getCountries(){
      await this.$doTask(async ()=> {
        const response = await this.$axios.get('countries');
        this.countries = response.data;
      }, 'Loading...');
    },
    updateCountry(data){
      let index = _.findIndex(this.countries, c => c.id === data.id);
      this.countries[index] = data;
    },
    newCountry(){
      this.openCountryModal = true;
      this.editCountryData = null;
      console.log('new country', this.editCountryData);
    },
    editCountry(country){
      this.editCountryData = country;
      this.openCountryModal = true;
    },
    async deleteCountry(country){
      if (!confirm('Are you sure?')) return;

      await this.$doTask(async () => {
        await this.$axios.post('countries/delete', {
          id: country.id,
        });

        this.countries = _.filter(this.countries, (c) => {
          return country.id !== c.id;
        });

      }, 'Deleting...');
    }
  }
}
</script>

<style scoped>

</style>
