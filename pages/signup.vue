<template>

  <div class="container-scroller">
    <div class="container-fluid page-body-wrapper full-page-wrapper">
      <div class="content-wrapper auth p-0 theme-two">
        <div class="row d-flex align-items-stretch">
          <div class="col-md-4 banner-section d-none d-md-flex align-items-stretch justify-content-center">
            <div class="slide-content bg-1" style="background-image: url(https://picsum.photos/600/900)">
            </div>
          </div>
          <div class="col-12 col-md-8 h-100 bg-white">
            <div class="auto-form-wrapper d-flex align-items-center justify-content-center flex-column">
              <div class="nav-get-started">
                <p>Already have an account?</p>
                <nuxt-link to="/login" class="btn get-started-btn">
                  LOGIN
                </nuxt-link>
              </div>
              <div class="row w-100">
                <div class="col-12">
                  <div class="card card-body" style="max-height: 600px; overflow-y: auto">
                    <form-wizard title="Member Registration" @on-complete="submit"
                                 subtitle="Complete your registration in FIVE (5) easy steps."
                                 step-size="sm" color="#E77E23">
                      <tab-content title="Profile" :before-change="() => validateTab('profileTab')">
                        <div class="row w-100">
                          <div class="col-md-9 mx-auto">
                            <div class="card-body card">
                              <h4 class="card-title">Profile</h4>
                              <div class="mb-5 pt-4">
                                <vs-input v-model="member.firstName" label="First name" block />
                              </div>

                              <div class="mb-5">
                                <vs-input v-model="member.lastName" label="Last name" block />
                              </div>

                              <div class="form-row mb-5">
                                <div class="col-md-6">
                                  <vs-input v-model="member.phone" label="Phone:" block />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </tab-content>

                      <tab-content title="Membership" :before-change="() => validateTab('membershipTab')">
                        <div class="card card-body">
                          <div class="row">
                            <div class="col-md-7 mx-auto">
                              <h5 class="card-title">Choose an up-line and sponsor</h5>
                              <div class="row mt-5">
                                <div class="col-md-6">
                                  <div class="mb-2">
                                    <vs-input :loading="isCheckingUpLine" v-model="upLineUsername"
                                              type="search" block
                                              label="Username of up-line:" :readonly="ref !== undefined && ref !== null" />
                                  </div>

                                  <member-info-card :this-member="upLineMember"></member-info-card>

                                  <div class="d-flex flex-column justify-content-between align-items-start mt-3"
                                       v-if="upLineSuggestions.length">
                                    <p class="text-small text-primary font-weight-bold pb-0 mb-0">Up-Line suggestions:</p>
                                    <vs-radio dark v-model="upLineMember" :val="suggestion"
                                              v-for="(suggestion, index) in upLineSuggestions" :key="index">
                                      <div class="my-2">
                                        <h6 class="mb-0">{{suggestion.full_name}}</h6>
                                        <p class="p-0 m-0 text-small">{{suggestion.user.username}}</p>
                                      </div>
                                    </vs-radio>
                                  </div>

                                </div>
                                <div class="col-md-6">
                                  <div class="mb-2">
                                    <vs-input :loading="isCheckingSponsor" v-model="sponsorUsername"
                                              type="search" block
                                              label="Username of sponsor:" />
                                  </div>
                                  <member-info-card :this-member="sponsorMember"></member-info-card>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </tab-content>

                      <tab-content title="Next of Kin">
                        <div class="row w-100">
                          <div class="col-md-9 mx-auto">
                            <div class="card-body card">
                              <h3 class="card-title">Next of Kin</h3>
                              <div class="mb-5 pt-4">
                                <vs-input v-model="member.nok.name" label="Name" block />
                              </div>

                              <div class="mb-5">
                                <vs-input v-model="member.nok.email" label="Email" block />
                              </div>

                              <div class="form-row mb-5">
                                <div class="col-md-6">
                                  <vs-input v-model="member.nok.phone" label="Phone:" block />
                                </div>
                              </div>

                              <div class="mb-5">
                                <vs-input v-model="member.nok.address" label="Address:" block />
                              </div>

                            </div>
                          </div>
                        </div>
                      </tab-content>

                      <tab-content title="Bank Details" :before-change="() => validateTab('bankDetailsTab')">
                        <div class="row w-100">
                          <div class="col-md-9 mx-auto">
                            <div class="card-body card">
                              <h3 class="card-title">Bank Details</h3>
                              <div class="mb-5 pt-4">
                                <vs-input v-model="member.bankDetail.bankName" label="Name of Bank:" block />
                              </div>

                              <div class="mb-5">
                                <vs-input v-model="member.bankDetail.accountNumber"
                                          label="Account Number:" block />
                              </div>

                              <div class="mb-5">
                                <vs-input v-model="member.bankDetail.accountHolderName"
                                          label="Name of Account Holder:" block />
                              </div>

                            </div>
                          </div>
                        </div>
                      </tab-content>

                      <tab-content title="Security" :before-change="() => validateTab('securityTab')">
                        <div class="row w-100">
                          <div class="col-md-9 mx-auto">
                            <div class="card-body card">
                              <h3 class="card-title">Security</h3>
                              <div class="mb-5 pt-4">
                                <vs-input v-model="member.username"
                                          :loading="verifyingUsername"
                                          label="Your username:" block>
                                  <template v-if="verifiedUsername" #message-success>
                                    <i class="mdi mdi-check-circle"></i>
                                    Valid Username
                                  </template>
                                  <template v-if="!verifiedUsername && member.username.length" #message-danger>
                                    <i class="bx bxs-error"></i>
                                    Invalid username
                                  </template>
                                </vs-input>
                              </div>

                              <div class="mb-5">
                                <vs-input v-model="member.email"
                                          :loading="verifyingEmail"
                                          label="Your Email Address:" block>
                                  <template #message-success v-if="verifiedEmail">
                                    <i class="mdi mdi-check-circle"></i>
                                    Valid Email
                                  </template>
                                  <template v-if="!verifiedEmail && member.email.length" #message-danger>
                                    <i class="bx bxs-error"></i>
                                    Invalid email
                                  </template>
                                </vs-input>
                              </div>

                            </div>
                          </div>
                        </div>
                      </tab-content>

                      <template v-slot:next>
                        <vs-button primary>
                          Continue
                          <i class="bx bxs-right-arrow"></i>
                        </vs-button>
                      </template>

                      <template v-slot:prev>
                        <vs-button warn border>
                          <i class="bx bxs-left-arrow"></i>
                          Back
                        </vs-button>
                      </template>

                      <template v-slot:finish>
                        <vs-button success border>
                          <i class="bx bxs-check-circle"></i>
                          Complete
                        </vs-button>
                      </template>

                    </form-wizard>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- content-wrapper ends -->
    </div>
    <!-- page-body-wrapper ends -->
  </div>

</template>

<script>
import SelectCountryInput from "@/components/inputs/SelectCountryInput";
import MemberInfoCard from "@/components/MemberInfoCard";
import _ from 'lodash';
import {required, numeric, email, maxLength, minLength, alphaNum} from "vuelidate/lib/validators";

export default {
  name: "MemberSignup",
  components: {MemberInfoCard, SelectCountryInput},
  auth: 'guest',
  data(){
    return {
      member: {
        firstName: '',
        lastName: '',
        phone: '',
        branch: 0,
        bankDetail: {
          accountNumber: null,
          bankName: null,
          accountHolderName: null,
        },
        nok: {
          name: null,
          phone: null,
          email: null,
          address: null,
        },
        username: '',
        email: '',
      },
      selectedCountry: null,
      branches: [],

      upLineMember: null,
      isCheckingUpLine: false,
      upLineUsername: '',
      upLineSuggestions: [],

      isCheckingSponsor: false,
      sponsorMember: null,
      sponsorUsername: null,

      verifiedEmail: false,
      verifyingEmail: false,

      verifiedUsername: false,
      verifyingUsername: false,
    }
  },
  validations: {
    member: {
      firstName: {
        required
      },
      lastName: {
        required
      },
      phone: {
        required,
        numeric
      },
      bankDetail: {
        accountNumber: {
          required
        },
        bankName: {
          required
        },
        accountHolderName: {
          required
        },
      },
    },
    sponsorMember: {
      required
    },
    upLineMember: {
      required
    },
    verifiedUsername: {
      maxLength: maxLength(12),
      minLength: minLength(4),
      alphaNum,
      required(data){
        return this.verifiedUsername;
      },
    },
    verifiedEmail: {
      required(data){
        return this.verifiedEmail;
      }
    },
    profileTab: ['member.firstName', 'member.lastName', 'member.phone'],
    membershipTab: ['upLineMember', 'sponsorMember'],
    bankDetailsTab: ['member.bankDetail.accountNumber', 'member.bankDetail.bankName', 'member.bankDetail.accountHolderName'],
    securityTab: ['verifiedUsername', 'verifiedEmail'],
  },
  methods: {
    async fetchBranchesInCountry(){
      const countryId = this.selectedCountry.id;
      let response = await this.$axios.get('branches/country/' + countryId);
      this.branches = response.data;
    },
    async checkMember(username, asSponsor) {
      if (username === "") return;

      if (asSponsor){
        this.isCheckingSponsor = true;
        this.sponsorMember = null;
      } else {
        this.isCheckingUpLine = true;
        this.upLineMember = null;
        this.upLineSuggestions = [];
      }

      let response = await this.$axios.get("/members/check/" + username, {
        params: {
          withSuggestions: this.isCheckingUpLine
        }
      });

      const data = response.data;

      // turn off checking indicator
      if (asSponsor){
        this.isCheckingSponsor = false;
      } else {
        this.isCheckingUpLine = false;
      }

      if(data.member === undefined || (data.member.status === 'inactive')){
        this.$vs.notification({
          text: 'No member identified as ' + (asSponsor ? 'sponsor' : 'up-line'),
          position: 'top-center',
          color: 'danger'
        })
        return ;
      }

      // assign data
      if (asSponsor){
        this.sponsorMember = data.member;
      } else {
        if (data.suggestions){
          if (data.suggestions.length){
            this.upLineSuggestions = data.suggestions || [];
          }
        }

        if(data.member.direct_down_lines_count <= 5){
          this.upLineMember = data.member;
        }
      }
    },
    selectUpLineSuggestion(member){
      this.upLineMember = member;
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
    validateTab(tab){
      this.$v[tab].$touch();
      return !this.$v[tab].$invalid;
    },
    async submit(){
      let response;

      await this.$doTask(async () => {
        const member = Object.assign({
          upLineMemberId : this.upLineMember.id,
          sponsorMemberId: this.sponsorMember.id,
          nokName: this.member.nok.name,
          nokEmail: this.member.nok.email,
          nokAddress: this.member.nok.address,
          nokPhone: this.member.nok.phone,
          accountHolderName: this.member.bankDetail.accountHolderName,
          accountNumber: this.member.bankDetail.accountNumber,
          bankName: this.member.bankDetail.bankName,
          branchId: this.member.branch
        }, this.member);

        member.bankDetail = undefined;
        member.nok = undefined;
        member.branch = undefined;

        response = await this.$axios.post('/members/save', member);
      }, "Saving member...");

      if (response){
        this.$vs.notification({
          title: 'Registration successful. Please login',
          position: 'top-center',
          color: 'success'
        });
        await this.$router.push("/login");
      }
    }
  },
  watch: {
    selectedCountry(){
      this.fetchBranchesInCountry();
    },
    sponsorUsername: _.debounce(function(username){
      this.sponsorMember = null;
      this.checkMember(username, true);
    },1000),
    upLineUsername: _.debounce(function(username){
      this.upLineMember = null;
      this.upLineSuggestions = [];
      this.checkMember(username, false);
    },1000),
    'member.username': _.debounce(function(username){
      this.verifiedUsername = false;
      if (username.length < 4 || username.length > 12 || username.indexOf(' ') >= 0) return false;
      this.checkUsername(username);
    },1000),
    'member.email': _.debounce(function(email){
      this.verifiedEmail = false;
      this.checkEmail(email);
    }, 1000),
  },
  asyncData({query}){
    return query;
  },
  mounted() {
    const referrer = this.ref;
    console.log('ref', referrer);
    if (referrer){
      this.upLineUsername = referrer;
      this.sponsorUsername = referrer;
    }
  }
}
</script>

<style scoped>

</style>
