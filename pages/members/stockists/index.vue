<template>

  <div class="row" ref="members-list">
    <div class="col-12">
      <div class="row mb-3">
        <div class="col-12 d-flex justify-content-between">
          <h3 class="display-4">Members (Stockists)</h3>
          <vs-button active success square flat @click="newStockistsModal.show = true"
          v-authorization="permissions.RegisterNewStockist">
            <i class="mdi mdi-plus"></i>
            New Stockist
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
                         v-show="
                           searchData.username ||
                           searchData.name ||
                           searchData.stage"
                         circle size="small" icon @click="resetSearch">
                <i class="bx bxs-x-square"></i>
              </vs-button>
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
                  <th>Sponsor</th>
                  <th>Up-Line</th>
                  <th style="width: 40px;"></th>
                </tr>
                </thead>
                <tbody>
                <tr style="cursor: pointer"
                    :key="index"
                    :class="{'text-danger': member.status === 'inactive',
                    'text-warning': member.status === 'pending',
                    'text-muted': member.status === 'muted'}"
                    v-for="(member, index) in members">
                  <td>{{index + 1}}</td>
                  <td>
                    <vs-avatar class="d-inline-block" :warn="member.pending" :danger="member.inActive"
                               :dark="member.muted"
                               :success="member.active" size="35">
                      <template #text v-if="!member.avatar">
                        {{ member.full_name }}
                      </template>

                      <img :src="$backendFiles(member.avatar)" v-if="member.avatar" alt="">
                    </vs-avatar>
                  </td>
                  <td>
                    <span class="font-weight-semibold">{{member.full_name}}</span>
                    <br>
                    <span>{{member.user.username}}</span>
                  </td>
                  <td>
                    {{member.branch.name}} / <br>
                    {{member.domain.country.name}}
                  </td>
                  <td>{{member.phone}}</td>
                  <td>
                    <div v-if="member.sponsor_member">
                      {{member.sponsor_member.full_name}} / <br>
                      {{member.sponsor_member.user.username}}
                    </div>
                  </td>
                  <td>
                    <div v-if="member.up_line_member">
                      {{member.up_line_member.full_name}} / <br>
                      {{member.up_line_member.user.username}}
                    </div>
                  </td>
                  <td>
                    <div class="d-flex">
                      <vs-button flat blank @click="$router.push('/members/stockists/' + member.user.username + '/details')">
                        <i class="bx bx-show"></i>
                        S/Dash
                      </vs-button>
                      <vs-button blank @click="$router.push('/members/' + member.user.username + '/details')">
                      <i class="bx bx-show"></i>
                      M/Dash
                    </vs-button>
                      <vs-button size="small" warn
                                 @click="removeStockist(member.user.username)">
                        <i class="mdi mdi-account-remove"></i>
                        remove
                      </vs-button>
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
    <member-search-dialog @closed="showSearchDialog = false" :show="showSearchDialog"></member-search-dialog>

    <vs-dialog blur v-model="newStockistsModal.show" @close="newStockistsModal.show = false">
      <template #header>
        <h4 class="not-margin">
          New <b>Stockist</b>
        </h4>
      </template>

      <div class="con-form mt-3">
        <div class="form-group">
          <vs-input block label="Username" :loading="newStockistsModal.verifyingUsername"
                    v-model="newStockistsModal.payload.username"></vs-input>
        </div>

        <member-info-card :this-member="newStockistsModal.stockistMember"></member-info-card>

      </div>

      <template #footer>
        <div class="footer-dialog">
          <vs-button @click="makeStockist" :disabled="!newStockistsModal.stockistMember" block>
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

export default {
  name: "index",
  components: {MemberInfoCard, MemberSearchDialog},
  layout: "app",
  data(){
    return {
      shouldRefresh: false,
      page: 1,
      showSearchDialog: false,
      members: [],
      pagination: null,
      totalPages: 1,
      search: {
        username: null,
        name: null,
        stage: null,
      },
      newStockistsModal: {
        show: false,
        stockistMember: null,
        verifyingUsername: false,
        payload: {
          username: ''
        }
      }
    }
  },
  async fetch(){
    await this.getMembersList();
  },
  methods: {
    async checkMember(username) {
      this.newStockistsModal.stockistMember = null;
      this.newStockistsModal.verifyingUsername = true;

      let response = await this.$axios.get("/members/check/" + username, {
        params: {
          withSuggestions: false
        }
      });

      const data = response.data;
      this.newStockistsModal.verifyingUsername = false;


      if(data.member === undefined){
        this.$vs.notification({
          text: 'No member identified as stockist',
          position: 'top-center',
          color: 'danger'
        })
        return ;
      }

      this.newStockistsModal.stockistMember = data.member;
    },
    async makeStockist(){
      this.shouldRefresh = false;

      await this.$doTask(async () => {
        let response = await this.$axios.post('members/stockists/add', {
          username: this.newStockistsModal.payload.username
        });

        this.shouldRefresh = true;
        this.newStockistsModal.show = false;
      });
    },
    async removeStockist(username){
      this.shouldRefresh = false;

      await this.$doTask(async () => {
        let response = await this.$axios.post('members/stockists/remove', {
          username: username
        });

        this.shouldRefresh = true;
      });
    },
    async getMembersList(){
      await this.$doTask(async ()=>{
        let response = await this.$axios.$get('members/stockists', {
          params : {
            page: this.page,
            ...this.search
          }
        });

        this.members = response.data;
        this.totalPages = response.last_page;
      }, 'Fetching members...', this.$refs['members-list']);
    },
    async resetSearch(){
      this.search = {
        username: null,
        name: null,
        stage: null,
      }
      await this.getMembersList();
    }
  },
  watch: {
    page: async function (_, __){
      await this.getMembersList();
    },
    shouldRefresh(shouldRefresh, __){
      if (shouldRefresh){
        this.page = 1;
        this.getMembersList();
      }
    },
    'newStockistsModal.payload.username': _.debounce(function(username){
      this.checkMember(username);
    }, 500)
  },
  computed: {
    searchData(){
      return this.search;
    },
    permissions(){
      return Permissions;
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
