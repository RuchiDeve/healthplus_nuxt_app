<template>
  <div class="card card-body">
    <div class="row">
      <div class="col-12">
        <h4 class="card-title">Partner Form</h4>
      </div>
    </div>
    <div class="row pt-5">
      <div class="col-sm-6">
        <div class="form-group mb-5">
          <vs-input block label="First Name" v-model="partner.firstName"></vs-input>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="form-group mb-5">
          <vs-input block label="Last Name" v-model="partner.lastName"></vs-input>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-6">
        <div class="form-group mb-5">
          <vs-input block label="Bank" v-model="partner.bank"></vs-input>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="form-group mb-5">
          <vs-input block label="Account Number:" v-model="partner.accountNumber"></vs-input>
        </div>
      </div>
    </div>

    <div class="form-group mb-5">
      <vs-input block label="Address" v-model="partner.address"></vs-input>
    </div>

    <div class="row mb-5">
      <div class="col-sm-6">
        <div class="form-group ">
          <vs-input block label="Phone" v-model="partner.phone"></vs-input>
        </div>
      </div>

    </div>

    <div class="row mb-5">
      <div class="col-sm-7">
        <div class="form-group">
          <vs-input block label="Email" type="email" v-model="partner.email">

            <template #message-success v-if="verifiedEmail">
              <i class="mdi mdi-check-circle"></i>
              Valid Email
            </template>
            <template v-if="!verifiedEmail && partner.email.length" #message-danger>
              <i class="bx bxs-error"></i>
              Invalid email
            </template>

          </vs-input>

        </div>
      </div>
      <div class="col-sm-5">
        <div class="form-group">
          <vs-input block label="Username" type="email" v-model="partner.username">
            <template v-if="verifiedUsername" #message-success>
              <i class="mdi mdi-check-circle"></i>
              Valid Username
            </template>
            <template v-if="!verifiedUsername && partner.username.length" #message-danger>
              <i class="bx bxs-error"></i>
              Invalid username
            </template>
          </vs-input>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <vs-button success @click="validateAndSave">
          Save Partner
        </vs-button>
      </div>
    </div>

  </div>
</template>

<script>
import SelectCountryInput from "@/components/inputs/SelectCountryInput";
import {required, numeric, email, minLength} from "vuelidate/lib/validators";
import _ from "lodash";

export default {
  name: "PartnerForm",
  components: {SelectCountryInput},
  data(){
    return {
      partner: {
        id: null,
        firstName: '',
        lastName: '',
        bank: '',
        accountNumber: '',
        username: '',
        email: '',
        address: '',
        phone: '',
      },
      loading: false,
      verifiedEmail: false,
      verifyingEmail: false,

      verifiedUsername: false,
      verifyingUsername: false,
    }
  },
  validations: {
    partner: {
      firstName: {
        required,
        minLength: minLength(5)
      },
      lastName: {
        required
      },
      bank: {
        required
      },
      accountNumber: {
        required
      },
      address: {
        required
      },
      phone: {
        required
      },
    },
    verifiedUsername: {
      required(data){
        return this.verifiedUsername;
      }
    },
    verifiedEmail: {
      required(data){
        return this.verifiedEmail;
      }
    },
  },
  props: {
    defaultPartner: {
      required: false,
      type: Object,
    }
  },
  methods: {
    validateAndSave(){
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.save();
      }
    },
    async save(){
      this.loading = true;
      let response = await this.$axios.post('partners', this.partner);
      this.loading = false;
      this.$emit('saved', response.data);
      this.reset();
    },
    reset(){
      this.partner = {
        firstName: '',
        lastName: '',
        bank: '',
        accountNumber: '',
        username: '',
        email: '',
        address: '',
        phone: '',
      }
    },
    initFromDefaultPartner(partner){
      this.partner.id = partner.id;
      this.partner.firstName = partner.firstName;
      this.partner.lastName = partner.lastName;
      this.partner.bank = partner.bank;
      this.partner.address = partner.address;
      this.partner.accountNumber = partner.accountNumber;
      this.partner.email = partner.user.email;
      this.partner.username = partner.user.userName;
      this.partner.phone = partner.phone;
    },
    async checkUsername(username){
      if (username === "") return;
      this.verifyingUsername = true;
      let response = await this.$axios.get("/security/check/username/" + username, {
        params : {
          activeOnly: true
        }
      });

      this.verifiedUsername = !response.data.exists;
      this.verifyingUsername = false;
    },
    async checkEmail(email){
      if (email === "") return;

      this.verifyingEmail = true;

      let response = await this.$axios.get("/security/check/email/" + email);

      this.verifiedEmail = !response.data.exists;
      this.verifyingEmail = false;
    },
  },
  mounted() {
    if (this.defaultPartner){
      this.initFromDefaultPartner(this.defaultPartner);
    }
  },
  watch: {
    loading(){
      this.$emit('loading', this.loading);
    },
    'partner.username': _.debounce(function(username){
      this.verifiedUsername = false;
      this.checkUsername(username);
    },1000),
    'partner.email': _.debounce(function(email){
      this.verifiedEmail = false;
      this.checkEmail(email);
    }, 1000),
  }
}
</script>

<style scoped>

</style>
