<template>

  <div class="row" ref="branches-list">
    <div class="col-12">
      <div class="row mb-3">
        <div class="col-12 d-flex justify-content-between">
          <h3 class="display-4">Branches</h3>
          <vs-button active success square flat @click="openNewBranchModal"
          v-authorization="permissions.NewBranch">
            <i class="mdi mdi-plus"></i>
            New Branch
          </vs-button>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card" >
            <div class="card-body d-flex justify-content-between align-items-center">
              <div class="d-flex align-self-center" v-if="totalPages">
                <vs-pagination only-arrows v-model="page" :length="totalPages" />
                <span class="align-self-center badge badge-info">
                    Page: <b>{{ page }}</b> of {{totalPages}}
                  </span>
              </div>

              <div class="">
                <button class="btn btn-sm btn-outline-primary"
                        @click="showSearchDialog = !showSearchDialog"
                        data-toggle="modal" data-target="#searchModal">
                  <i class="mdi mdi-account-search"></i>
                  Search...
                </button>
              </div>

              <vs-button danger class="align-self-center"
                         v-show="shouldResetSearchDialog"
                         circle size="small" icon @click="resetSearch">
                <i class="bx bxs-x-square"></i>
              </vs-button>
            </div>

            <div class="table-responsive">
              <table class="table table-hover table-condensed" style="table-layout: initial">
                <thead class="">
                <tr>
                  <th style="width: 5px;"></th>
                  <th>Name</th>
                  <th>Admin</th>
                  <th>Account / Bank</th>
                  <th>Address</th>
                  <th>Country</th>
                  <th style="width: 40px;"></th>
                </tr>
                </thead>
                <tbody>
                <tr style="cursor: pointer"
                    :key="index"
                    v-for="(branch, index) in branches">
                  <td>{{index + 1}}</td>
                  <td>
                    <span class="font-weight-semibold">{{branch.name}}</span>
                  </td>
                  <td>
                    <div v-if="branch.staff_admin">
                      <span class="font-weight-semibold">{{branch.staff_admin.full_name}}</span>
                      <br>
                      <span class="">({{branch.staff_admin.user.username}})</span>
                    </div>
                  </td>
                  <td>{{branch.account_number}} / {{branch.bank}}</td>
                  <td>{{branch.address}}</td>
                  <td>{{branch.country.name}}</td>
                  <td>
                    <div class="dropdown show">
                      <a class="btn btn-inverse-dark btn-xs dropdown-toggle" href="javascript:void(0)" role="button"
                         id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Action
                        <i class="bx bx-dots-vertical-rounded"></i>
                      </a>
                      <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                        <a class="dropdown-item" href="javascript:void(0)"
                           @click="$router.push('/branches/' + branch.id + '/details')">
                          <i class="bx bxs-dashboard"></i>
                          view
                        </a>
                        <a class="dropdown-item" href="javascript:void(0)"
                           @click="openEditBranchModal(branch)">
                          <i class="bx bx-edit"></i>
                          edit
                        </a>
                        <a class="dropdown-item" href="javascript:void(0)"
                           @click="openChangeBranchAdminModal(branch)">
                          <i class="bx bx-cog"></i>
                          Change Admin
                        </a>
                        <br>
                        <a class="dropdown-item" href="javascript:void(0)"
                           @click="removeBranch(branch)">
                          <i class="bx bx-edit"></i>
                          delete
                        </a>
                      </div>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
        <div class="col-12 mt-4" v-if="totalPages">
          <vs-pagination v-model="page" :length="totalPages" />
        </div>
      </div>
    </div>

    <vs-dialog blur v-model="newBranchModal.show" @close="newBranchModal.show = false">
      <template #header>
        <h4 class="not-margin">
          {{newBranchModal.selectedBranch ? newBranchModal.selectedBranch.name + ': Edit' : 'New'}}
          <b>Branch</b>
        </h4>
      </template>

      <div class="con-form mt-3">
        <div class="form-group mb-5">
          <vs-input block label="Branch Name"
                    v-model="newBranchModal.payload.name"></vs-input>
        </div>

        <div class="form-group mb-5">
          <vs-input block label="Account Number"
                    v-model="newBranchModal.payload.account"></vs-input>
        </div>

        <div class="form-group mb-5">
          <vs-input block label="Bank"
                    v-model="newBranchModal.payload.bank"></vs-input>
        </div>

        <div class="form-group mb-5">
          <vs-input block label="Address"
                    v-model="newBranchModal.payload.address"></vs-input>
        </div>

<!--        <div class="form-group mb-5">
          <vs-input block label="Phone"
                    v-model="newBranchModal.payload.phone"></vs-input>
        </div>-->

        <select-country-input v-model="newBranchModal.selectedCountry"></select-country-input>
      </div>

      <template #footer>
        <div class="footer-dialog">
          <vs-button @click="saveBranch" :disabled="!hasCompletedAllFieldsForNewBranch" block>
            Submit
          </vs-button>
        </div>
      </template>
    </vs-dialog>

    <vs-dialog blur v-model="changeAdminModal.show" @close="changeAdminModal.show = false">
      <template #header>
        <h4 class="not-margin">
          <span v-if="changeAdminModal.selectedBranch">
            {{changeAdminModal.selectedBranch.name}}:
          </span> <b>Change Branch Admin</b>
        </h4>
      </template>

      <div class="con-form mt-3">

        <div class="form-group">
          <vs-input block label="Staff's Username" :loading="changeAdminModal.verifyingUsername"
                    v-model="changeAdminModal.staffUsername"></vs-input>
        </div>

        <staff-info-card :this-staff="changeAdminModal.staff"></staff-info-card>

      </div>

      <template #footer>
        <div class="footer-dialog">
          <vs-button @click="changeBranchAdmin" :disabled="!hasCompletedAllFieldsToChangeBranchAdmin" block>
            Submit
          </vs-button>
        </div>
      </template>
    </vs-dialog>

  </div>

</template>

<script>
import {Permissions} from "@/utils/permissions";
import MemberSearchDialog from "@/components/MemberSearchDialog";
import MemberInfoCard from "@/components/MemberInfoCard";
import SelectCountryInput from "~/components/inputs/SelectCountryInput";
import StaffInfoCard from "~/components/StaffInfoCard";

export default {
  name: "index",
  components: {StaffInfoCard, SelectCountryInput, MemberInfoCard, MemberSearchDialog},
  layout: "app",
  data(){
    return {
      shouldRefresh: false,
      page: 1,
      showSearchDialog: false,
      branches: [],
      pagination: null,
      totalPages: 1,
      search: {
        username: null,
        name: null,
        stage: null,
      },
      newBranchModal: {
        show: false,
        selectedBranch: null,
        stateRepMember: null,
        verifyingUsername: false,
        selectedCountry: null,
        payload: {
          name: '',
          account: '',
          bank: '',
          // phone: '',
          address: '',
          country: '',
        }
      },
      changeAdminModal: {
        show: false,
        staff: null,
        staffUsername: '',
        selectedBranch: null,
        verifyingUsername: false,
        payload: {
          staff: '',
          branch: null,
        }
      }
    }
  },
  async fetch(){
    await this.getBranches();
  },
  methods: {
    openNewBranchModal(){
      this.newBranchModal.show = true;
      this.newBranchModal.selectedBranch = null;
      this.newBranchModal.payload.name = '';
      this.newBranchModal.payload.country = '';
      this.newBranchModal.payload.account = '';
      this.newBranchModal.payload.address = '';

      this.newBranchModal.selectedCountry = null;
    },
    openEditBranchModal(branch){
      this.newBranchModal.selectedBranch = branch;
      this.newBranchModal.show = true;
      this.newBranchModal.payload.name = branch.name;
      this.newBranchModal.payload.bank = branch.bank;
      this.newBranchModal.payload.country = branch.country_id;
      this.newBranchModal.payload.account = branch.account_number;
      this.newBranchModal.payload.address = branch.address;

      this.newBranchModal.selectedCountry = branch.country;
    },
    openChangeBranchAdminModal(branch){
      this.changeAdminModal.selectedBranch = branch;
      this.changeAdminModal.payload.branch = branch.id;
      this.changeAdminModal.show = true;
    },
    async changeBranchAdmin(){
      await this.$doTask(async ()=>{
        let response = await this.$axios.$post('branches/change-admin', this.changeAdminModal.payload);
      }, 'Changing Branch Admin', this.$refs['branches-list']);
      this.changeAdminModal.show = false;
      this.shouldRefresh = true;
    },
    async saveBranch(){
      await this.$doTask(async ()=>{
        if(this.newBranchModal.selectedBranch){
          this.newBranchModal.payload.id = this.newBranchModal.selectedBranch.id;
        }
        let response = await this.$axios.$post('branches', this.newBranchModal.payload);

      }, 'Saving branches...', this.$refs['branches-list']);

      this.newBranchModal.show = false;
      this.shouldRefresh = true;

    },
    async removeBranch(branch){
      if(!confirm('Are you sure?')) return ;

      this.shouldRefresh = false;

      await this.$doTask(async () => {
        let response = await this.$axios.post('branches/remove', {
          branchId: branch.id
        });

        this.shouldRefresh = true;
      });
    },
    async getBranches(){
      await this.$doTask(async ()=>{
        let response = await this.$axios.$get('branches', {
          params : {
            page: this.page,
            ...this.search
          }
        });

        this.branches = response.data;
        this.totalPages = response.last_page;
      }, 'Fetching branches...', this.$refs['branches-list']);
    },
    async resetSearch(){
      this.search = {
        username: null,
        name: null,
        stage: null,
      }
      await this.getBranches();
    },
    async checkStaff(username) {
      this.changeAdminModal.staff = null;

      if(username === ''){
        return ;
      }

      this.changeAdminModal.verifyingUsername = true;

      let data = await this.$axios.$get("/staffs/check/" + username);

      this.changeAdminModal.verifyingUsername = false;

      if(data.staff === undefined){
        this.$vs.notification({
          text: 'No staff found with provided username',
          position: 'top-center',
          color: 'danger'
        })
        return ;
      }

      this.changeAdminModal.staff = data.staff;
      this.changeAdminModal.payload.staff = data.staff.id;
    },
  },
  watch: {
    page: async function (_, __){
      await this.getBranches();
    },
    shouldRefresh(shouldRefresh, __){
      if (shouldRefresh){
        this.page = 1;
        this.getBranches();
      }
    },
    'newBranchModal.selectedCountry': function (country, __){
      if(country){
        this.newBranchModal.payload.country = country.id;
      }
    },
    'changeAdminModal.staffUsername': _.debounce(function(username){
      this.checkStaff(username);
    }, 500),
  },
  computed: {
    searchData(){
      return this.search;
    },
    permissions(){
      return Permissions;
    },
    shouldResetSearchDialog(){
      var reset = false;

      for (const [key, value] of Object.entries(this.searchData)) {
        reset = !((value == null) || (value === ''));

        if(reset) break;
      }

      return reset;
    },
    hasCompletedAllFieldsForNewBranch(){
      var reset = false;

      for (const [key, value] of Object.entries(this.newBranchModal.payload)) {
        reset = !((value == null) || (value === ''));

        if(!reset) break;
      }

      return reset;
    },
    hasCompletedAllFieldsToChangeBranchAdmin(){
      var reset = false;

      for (const [key, value] of Object.entries(this.changeAdminModal.payload)) {
        reset = !((value == null) || (value === ''));

        if(!reset) break;
      }

      return reset;
    },
  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped>

  div.vs-card {
    max-width: 100% !important;
  }

</style>
