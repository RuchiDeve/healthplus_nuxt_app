<template>
  <vs-select block :loading="loading"
             v-if="countries.length"
             placeholder="Choose a country..."
             :disabled="loading" v-model="selectedCountryId">
    <vs-option
      :key="index"
      :label="country.name"
      v-for="(country, index) in countries"
      :value="country.id">
      {{ country.name }}
    </vs-option>
  </vs-select>
</template>

<script>
export default {
  name: "SelectCountryInput",
  data(){
    return {
      loading: false,
      selectedCountryId: 0,
      countries: [],
    }
  },
  props: {
    value: {
      required: false,
    }
  },
  methods: {
    async getCountries(){
      this.loading = true;
      const response = await this.$axios.get('countries');
      this.countries = response.data;
      this.loading = false;
    },
    initDefault(){
      console.log('selected country', this.value);

      if (this.value){
        this.selectedCountryId = this.value.id;
      }
    }
  },
  async mounted() {
    await this.getCountries();
    this.initDefault();
  },
  computed: {
    selectedCountry(){
      return this.countries.find((country) => country.id === this.selectedCountryId);
    }
  },
  watch: {
    selectedCountryId(_, __){
      if (this.selectedCountry)
      this.$emit('input', this.selectedCountry)
    },
    value(){
      this.initDefault();
    }
  }
}
</script>

<style scoped>

</style>
