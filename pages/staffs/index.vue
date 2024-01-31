<template>

  <div class="row" ref="staffs-list">
    <div class="col-12">
      <div class="row mb-3">
        <div class="col-12 d-flex justify-content-between">
          <h3 class="display-4">Staffs</h3>
          <vs-button @click="newStaff" size="large" active success square
                     v-authorization="permissions.RegisterNewStaff">
            <i class="mdi mdi-plus"></i>
            New Staff
          </vs-button>
        </div>
        <vs-dialog blur :loading="staffModal.loading" v-model="staffModal.show"
                   @close="staffModal.show = false">
          <template #header>
            <h4 class="not-margin">
              <b>{{staffModal.payload.id ? 'Edit' : 'Add'}}</b> Staff
            </h4>
          </template>

          <div class="con-form mt-3">
            <div class="form-group mb-5">
              <vs-input block label="First Name" v-model="staffModal.payload.first_name"></vs-input>
            </div>

            <div class="form-group mb-5">
              <vs-input block label="last Name" v-model="staffModal.payload.last_name"></vs-input>
            </div>

            <div class="form-group mb-5">
              <vs-input block label="Phone" v-model="staffModal.payload.phone"></vs-input>
            </div>

            <div class="form-group mb-5">
              <vs-input block label="Email" type="email" v-model="staffModal.payload.email"></vs-input>
            </div>

            <div class="form-group mb-5">
              <vs-input block label="Username" v-model="staffModal.payload.username"></vs-input>
            </div>

            <div class="form-row mb-5">
              <div class="col-md-6">
                <select-country-input v-model="staffModal.selectedCountry"></select-country-input>
              </div>
              <div class="col-md-6">
                <vs-select block placeholder="Select a Branch..."
                           v-model="staffModal.payload.branch_id" v-if="branches.length">
                  <vs-option v-for="(branch, index) in branches" :key="index"
                             :value="branch.id" :label="branch.name">
                    {{branch.name}}
                  </vs-option>
                </vs-select>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="footer-dialog">
              <vs-button @click="save" :loading="staffModal.loading"
                         :active-disabled="staffModal.loading" block>
                Submit
              </vs-button>
            </div>
          </template>
        </vs-dialog>
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
            </div>

            <div class="table-responsive">
              <table class="table table-hover table-condensed" style="table-layout: initial">
                <thead class="">
                <tr>
                  <th style="width: 5px;"></th>
                  <th></th>
                  <th>Name</th>
                  <th>Branch / Country</th>
                  <th>Phone</th>
                  <th style="width: 20px;"></th>
                </tr>
                </thead>
                <tbody>
                <tr style="cursor: pointer"
                    :key="index"
                    v-for="(staff, index) in staffs">
                  <td>{{index + 1}}</td>
                  <td>
                    <vs-avatar class="d-inline-block" dark size="35">
                      <template #text v-if="!staff.avatar">
                        {{ staff.full_name }}
                      </template>

                      <img :src="staff.avatar" v-if="staff.avatar" alt="">
                    </vs-avatar>
                  </td>
                  <td>
                    <span class="font-weight-semibold">{{staff.full_name}}</span>
                    <br>
                    <span>{{staff.user.username}}</span>
                  </td>
                  <td>
                    {{staff.branch.name}} / <br>
                    {{staff.domain.country.name}}
                  </td>
                  <td>{{staff.phone}}</td>
                  <td>
                    <vs-button border dark @click="editStaff(staff)" size="small">
                      <i class="bx bxs-edit"></i>
                      Edit
                    </vs-button>
                    <vs-button size="small" danger @click="deleteStaff(staff)">
                      <i class="ti-check"></i>
                      delete
                    </vs-button>
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
    <staff-search-dialog @closed="showSearchDialog = false" :show="showSearchDialog"></staff-search-dialog>

  </div>

</template>

<script>
import {Permissions} from "@/utils/permissions";
import StaffSearchDialog from "~/components/StaffSearchDialog";
import SelectCountryInput from "~/components/inputs/SelectCountryInput";

export default {
  name: "index",
  components: {SelectCountryInput, StaffSearchDialog},
  layout: "app",
  data(){
    return {
      staffs: [],
      pagination: null,
      page: 1,
      totalPages: null,
      showSearchDialog: false,
      searchPayload: null,
      branches: [],
      staffModal: {
        loading: false,
        show: false,
        selectedCountry: null,
        payload: {
          first_name: '',
          last_name: '',
          phone: '',
          branch_id: null,
          username: '',
          email: '',
        }
      }
    }
  },
  async fetch(){
    await this.getStaffsList();
  },
  methods: {
    async getStaffsList(){
      await this.$doTask(async () => {

        let response = await this.$axios.$get('staffs', {
          params: {
            page: this.page,
            ...this.searchPayload
          }
        });

        this.staffs = response.data;
        // this.pagination = response.data.pagination;
        this.totalPages = response.last_page;
        this.searchPayload = null;
      }, 'Loading staffs...', this.$refs['staffs-list']);
    },
    async fetchBranchesInCountry(){
      const countryId = this.staffModal.selectedCountry.id;
      let response = await this.$axios.get('branches/country/' + countryId);
      this.branches = response.data;
    },
    newStaff(){
      this.reset();
      this.staffModal.show = true;
    },
    editStaff(staff){
      this.staffModal.payload.id = staff.id;
      this.staffModal.payload.first_name = staff.first_name;
      this.staffModal.payload.last_name = staff.last_name;
      this.staffModal.payload.phone = staff.phone;
      this.staffModal.payload.username = staff.user.username;
      this.staffModal.payload.email = staff.user.email;
      this.staffModal.payload.branch_id = staff.branch_id;
      this.staffModal.show = true;
    },
    async save(){
      this.staffModal.loading = true;

      try {
        await this.$axios.post('staffs/save', this.staffModal.payload);

        this.$vs.notification({
          title: 'Success',
          text: 'Country was saved.',
          color: 'success',
          position: 'top-center'
        });

        window.location.reload();

      } catch (e){

      }

      this.staffModal.loading = false;
      this.staffModal.show = false;
    },
    reset(){
      this.staffModal.payload = {
        first_name: '',
        last_name: '',
        phone: '',
        branch_id: null,
        username: '',
        email: '',
      }
    },
  },
  watch: {
    page: async function (_, __){
      await this.$store.commit('staffs/setPageNumbers', this.page);

      await this.getStaffsList();
    },
    selectedCountry(){
      this.fetchBranchesInCountry();
    },
    async deleteStaff(staff){
      if (!confirm('Are you sure?')) return;

      await this.$doTask(async () => {
        let response = await this.$axios.post("staffs/delete/" + staff.id);
        console.log('staffs deleted', response.data);
      }, "Deleting...");

      window.location.reload();

    }
  },
  computed: {
    searchData(){
      return this.searchPayload;
    },
    permissions(){
      return Permissions;
    }
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
