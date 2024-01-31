<template>
  <vs-select block :loading="loading"
             label="Currency"
             v-if="$store.state.currencies.length"
             label-placeholder="Select a currency..."
             :disabled="loading" v-model="selectedCurrencyId">
    <vs-option
      :key="index"
      :label="currency.name + ' ' + currency.abbr"
      v-for="(currency, index) in $store.state.currencies"
      :value="currency.id">
      {{ currency.name }} ({{currency.abbr}})
    </vs-option>
  </vs-select>
</template>

<script>
export default {
  name: "SelectCurrencyInput",
  data(){
    return {
      loading: false,
      selectedCurrencyId: 0,
    }
  },
  props: {
    value: {
      required: false,
    }
  },
  methods: {
    async loadCurrencies(){
      this.loading = true;
      await this.$store.dispatch('fetchCurrencies');
      this.loading = false;
    }
  },
  async mounted() {
    await this.loadCurrencies();
    if (this.value){
      this.selectedCurrencyId = this.value.id;
    }
  },
  computed: {
    selectedCurrency(){
      return this.$store.state.currencies.find((currency) => currency.id === this.selectedCurrencyId);
    }
  },
  watch: {
    selectedCurrencyId(_, __){
      this.$emit('input', this.selectedCurrency)
    }
  }
}
</script>

<style scoped>

</style>
