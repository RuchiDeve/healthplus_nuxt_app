<template>
  <div class="card card-body">
    <div class="row">
      <div class="col-12">
        <h4 class="card-title">Supplier Form</h4>
      </div>
    </div>
    <div class="row pt-5">
      <div class="col-sm-6">
        <div class="form-group mb-5">
          <vs-input block label="First Name" v-model="supplier.firstName"></vs-input>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="form-group mb-5">
          <vs-input block label="Last Name" v-model="supplier.lastName"></vs-input>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-6">
        <div class="form-group mb-5">
          <vs-input block label="Bank" v-model="supplier.bank"></vs-input>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="form-group mb-5">
          <vs-input block label="Account Number:" v-model="supplier.accountNumber"></vs-input>
        </div>
      </div>
    </div>

    <div class="form-group mb-5">
      <vs-input block label="Address" v-model="supplier.address"></vs-input>
    </div>

    <div class="row mb-5">
      <div class="col-sm-6">
        <div class="form-group ">
          <vs-input block label="Phone" v-model="supplier.phone"></vs-input>
        </div>
      </div>
      <div class="col-sm-6">
        <select-country-input v-model="selectedCountry"></select-country-input>
      </div>

    </div>

    <div class="row mb-5">
      <div class="col-sm-7">
        <div class="form-group">
          <vs-input block label="Email" type="email" v-model="supplier.email"></vs-input>
        </div>
      </div>
      <div class="col-sm-5">
        <div class="form-group">
          <vs-input block label="Username" type="email" v-model="supplier.username"></vs-input>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <vs-button success @click="save">
          Save Supplier
        </vs-button>
      </div>
    </div>

  </div>
</template>

<script>
import SelectCountryInput from "@/components/inputs/SelectCountryInput";
export default {
  name: "SupplierForm",
  components: {SelectCountryInput},
  data(){
    return {
      supplier: {
        id: null,
        firstName: '',
        lastName: '',
        bank: '',
        accountNumber: '',
        username: '',
        email: '',
        address: '',
        phone: '',
        countryId: null
      },
      loading: false,
      selectedCountry: null,
    }
  },
  props: {
    defaultSupplier: {
      required: false,
      type: Object,
    }
  },
  methods: {
    async save(){
      this.loading = true;
      this.supplier.countryId = this.selectedCountry.id;
      let response = await this.$axios.post('suppliers', this.supplier);
      this.loading = false;
      this.$emit('saved', response.data);
      this.reset();
    },
    reset(){
      this.supplier = {
        firstName: '',
        lastName: '',
        bank: '',
        accountNumber: '',
        username: '',
        email: '',
        address: '',
        phone: '',
        countryId: null
      }
      this.selectedCountry = null;
    },
    initFromDefaultSupplier(supplier){
      this.supplier.id = supplier.id;
      this.supplier.firstName = supplier.firstName;
      this.supplier.lastName = supplier.lastName;
      this.supplier.bank = supplier.bank;
      this.supplier.address = supplier.address;
      this.supplier.accountNumber = supplier.accountNumber;
      this.supplier.email = supplier.user.email;
      this.supplier.username = supplier.user.userName;
      this.supplier.phone = supplier.phone;
      this.selectedCountry = supplier.country;
    }
  },
  mounted() {
    if (this.defaultSupplier){
      this.initFromDefaultSupplier(this.defaultSupplier);
    }
  },
  watch: {
    loading(){
      this.$emit('loading', this.loading);
    },
  }
}
</script>

<style scoped>

</style>
