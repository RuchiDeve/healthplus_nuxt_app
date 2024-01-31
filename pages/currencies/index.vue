<template>

  <div class="row">
    <div class="col-12">
      <div class="d-flex justify-content-between mt-5 mb-3">
        <h4 class="display-4">Currencies</h4>
        <div>
          <button class="btn btn-primary" @click="newCurrency"
          v-authorization="permissions.ManageCurrencies">
            <i class="bx bxs-plus-circle"></i>
            Add Currency
          </button>
          <vs-dialog blur :loading="currencyModal.loading" v-model="currencyModal.show"
                     @close="currencyModal.show = false">
            <template #header>
              <h4 class="not-margin">
                <b>{{currency.id ? 'Edit' : 'Add'}}</b> Currency
              </h4>
            </template>

            <div class="con-form mt-3">
              <div class="form-group mb-5">
                <vs-input block label="Name" v-model="currency.name"></vs-input>
              </div>

              <div class="form-group mb-5">
                <vs-input block label="Abbreviation" v-model="currency.abbr"></vs-input>
              </div>

              <div class="form-group mb-5">
                <vs-input block label="Symbol" v-model="currency.symbol"></vs-input>
              </div>

              <div class="form-group mb-5">
                <vs-input block label="Exchange rate (in NGN)" type="number"
                          v-model.number="currency.nairaEquivalent"></vs-input>
              </div>
            </div>

            <template #footer>
              <div class="footer-dialog">
                <vs-button @click="save" :loading="currencyModal.loading"
                           :active-disabled="currencyModal.loading" block>
                  Submit
                </vs-button>
              </div>
            </template>
          </vs-dialog>
        </div>
      </div>
      <div class="table-responsive card card-body">
        <table class="table table-hover table-condensed table-hover">
          <thead>
          <tr>
            <th>#</th>
            <th>Currency</th>
            <th>ABBR</th>
            <th>Symbol</th>
            <th>Exchange Rate (to Naira)</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(currency, index) in currencies" :key="index">
            <td>{{index + 1}}</td>
            <td>{{currency.name}}</td>
            <td>{{currency.abbr}}</td>
            <td>{{currency.symbol}}</td>
            <td>{{currency.nairaEquivalent | number}}</td>
            <td>
              <div class="d-flex">
                <vs-button v-authorization="permissions.ManageCurrencies"
                  dark @click="editCurrency(currency)" size="small">
                  <i class="bx bxs-edit"></i>
                  Edit
                </vs-button>
                <vs-button v-authorization="permissions.ManageCurrencies"
                  danger @click="deleteCurrency(currency)" size="small">
                  <i class="bx bxs-trash"></i>
                  Delete
                </vs-button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

</template>

<script>
import Helpers from "@/utils/helpers";
import {Permissions} from "@/utils/permissions";

export default {
  name: "index",
  layout: "app",
  middleware(){
    Helpers.authorize(Permissions.ViewCurrencies)
  },
  data(){
    return {
      currencies: [],
      currencyModal: {
        show: false,
        loading: false,
      },
      currency: {
        id: null,
        name: null,
        abbr: null,
        symbol: null,
        nairaEquivalent: null,
      }
    }
  },
  async fetch(){
    await this.getCurrencies();
  },
  methods: {
    async getCurrencies(){
      await this.$doTask(async ()=> {
        const response = await this.$axios.get('currencies');
        this.currencies = response.data;
      }, 'Loading...');
    },
    async save(){
      this.currencyModal.loading = true;

      try {
        const response = await this.$axios.post('currencies/save', _.clone(this.currency));

        this.$vs.notification({
          title: 'Success',
          text: 'Currency was saved.',
          color: 'success',
          position: 'top-center'
        });

        if (!this.currency.id)
        this.currencies.push(response.data);
      } catch (e){

      }

      this.currencyModal.loading = false;
      this.currencyModal.show = false;
    },
    reset(){
      this.currency = {
        id: null,
        name: null,
        abbr: null,
        symbol: null,
        nairaEquivalent: null,
      }
    },
    newCurrency(){
      this.reset();
      this.currencyModal.show = true;
    },
    editCurrency(currency){
      this.currency = currency;
      this.currencyModal.show = true;
    },
    async deleteCurrency(currency){
      if (!confirm('Are you sure?')) return;

      await this.$doTask(async () => {
        await this.$axios.post('currencies/delete', {
          id: currency.id,
        });

        this.currencies = _.filter(this.currencies, (curr) => {
          return currency.id !== curr.id;
        });

      }, 'Deleting...');
    }
  },
  computed:{
    permissions(){
      return Permissions;
    }
  }
}
</script>

<style scoped>

</style>
