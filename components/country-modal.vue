<template>
  <vs-dialog blur :loading="countryModal.loading" v-model="countryModal.show"
             @close="closeModal">
    <template #header>
      <h4 class="not-margin">
        <b>{{country.id ? 'Edit' : 'Add'}}</b> Country
      </h4>
    </template>

    <div class="con-form mt-3">
      <div class="form-group mb-5">
        <vs-input block label="Name" v-model="country.name"></vs-input>
      </div>

      <div class="form-group mb-5">
        <vs-input block label="Price per point"
                  type="number"
                  v-model="country.amount_per_point"></vs-input>
      </div>

      <div class="form-group mb-5">
        <vs-input block label="Matching Bonus"
                  type="number"
                  v-model="country.matching_bonus"></vs-input>
      </div>

      <div class="form-group mb-5">
        <vs-input block label="Registration Bonus"
                  type="number"
                  v-model="country.registration_bonus"></vs-input>
      </div>

      <div class="form-group mb-5">
        <vs-input block label="Registration Cost"
                  type="number"
                  v-model.number="country.registration_cost"></vs-input>
      </div>

      <div class="form-group mb-5">
        <select-currency-input v-model="country.currency"></select-currency-input>
      </div>

      <div class="form-group mb-5">
        <vs-input block label="Coordinator's bonus"
                  type="number"
                  v-model.number="country.coordinator_bonus_per_point"></vs-input>
      </div>

      <div class="form-group mb-5">
        <vs-input block label="State-Rep Target CPt."
                  type="number"
                  v-model.number="country.state_rep_target_point"></vs-input>
      </div>

      <div class="form-group mb-5">
        <vs-input block label="Stockist Bonus per bottle"
                  type="number"
                  v-model.number="country.stockist_bonus_per_bottle"></vs-input>
      </div>

      <div class="form-group">
        <image-upload-input v-model="country.flag"></image-upload-input>
      </div>
    </div>

    <template #footer>
      <div class="footer-dialog">
        <vs-button @click="save" :loading="countryModal.loading"
                   :active-disabled="countryModal.loading" block>
          Submit
        </vs-button>
      </div>
    </template>
  </vs-dialog>
</template>

<script>
import SelectCurrencyInput from "~/components/inputs/SelectCurrencyInput";
import ImageUploadInput from "~/components/inputs/ImageUploadInput";
export default {
  name: "country-modal",
  components: {ImageUploadInput, SelectCurrencyInput},
  data(){
    return {
      countryModal: {
        show: false,
        loading: false,
      },
      country: {
        id: null,
        name: null,
        flag: null,
        amount_per_point: null,
        registration_cost: null,
        registration_bonus: null,
        state_rep_target_point: null,
        coordinator_bonus_per_point: null,
        matching_bonus: 0,
        stockist_bonus_per_bottle: 0,
        currency: null,
      }
    }
  },
  props: {
    editCountry: {
      type: Object,
    },
    open: {
      type: Boolean,
      default: false,
    }
  },
  methods: {
    async save(){
      this.countryModal.loading = true;

      try {
        let countryPayload = _.clone(this.country);

        countryPayload.currency = this.country.currency.id;

        if (typeof countryPayload.flag !== 'object'){
          countryPayload.flag = null;
        }

        const formData = this.$payloadToFormData(countryPayload);

        const response = await this.$axios.post('countries/save', formData);

        if (!this.country.id){
          this.countries.push(response.data);
        } else {
          this.$emit('country-updated', response.data);
        }

        this.$vs.notification({
          title: 'Success',
          text: 'Country was saved.',
          color: 'success',
          position: 'top-center'
        });

      } catch (e){

      }

      this.countryModal.loading = false;
      this.countryModal.show = false;
    },
    reset(){
      this.country = {
        id: null,
        name: null,
        flag: null,
        amountPerPoint: null,
        registrationCost: null,
        registrationBonus: null,
        state_rep_target_point: null,
        matchingBonus: false,
        currency: null,
      }
    },
    closeModal(){
      this.countryModal.show = false;
      this.$emit('close', true);
    }
  },
  watch: {
    'open': function (isOpen, oldVal){
      this.countryModal.show = !!isOpen;
      const country = this.editCountry;
      if(country){
        this.country = country;
      } else {
        this.reset();
      }
    },
  }
}
</script>

<style scoped>

</style>
