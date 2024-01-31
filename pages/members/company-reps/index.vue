<template>

  <div class="row" ref="members-list">
    <div class="col-12">
      <div class="row mb-3">
        <div class="col-12 d-flex justify-content-between">
          <h3 class="display-4">State Reps.</h3>
          <vs-button active success square flat @click="newStateRepsModal.show = true"
          v-authorization="permissions.RegisterNewStateRep">
            <i class="mdi mdi-plus"></i>
            New State Rep.
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
                  <th>Name</th>
                  <th>Phone</th>
                  <th>State</th>
                  <th>State Rep ID</th>
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
                    <span class="font-weight-semibold">{{member.full_name}}</span>
                    <br>
                    <span>{{member.user.username}}</span>
                  </td>
                  <td>{{member.phone}}</td>
                  <td>{{member.state_to_cover}}</td>
                  <td>{{member.state_rep_id}}</td>
                  <td>
                    <vs-button blank @click="$router.push('/members/state-reps/' + member.state_rep_id + '/details')">
                      <i class="bx bxs-dashboard"></i>
                      view
                    </vs-button>
                    <vs-button warn @click="removeStateRep(member.user.username)">
                      <i class="bx bx-show"></i>
                      revoke
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
    <member-search-dialog @closed="showSearchDialog = false" :show="showSearchDialog"></member-search-dialog>

    <vs-dialog blur v-model="newStateRepsModal.show" @close="newStateRepsModal.show = false">
      <template #header>
        <h4 class="not-margin">
          New <b>State Rep</b>
        </h4>
      </template>

      <div class="con-form mt-3">
        <div class="form-group mb-5">
          <vs-input block label="State"
                    v-model="newStateRepsModal.payload.state"></vs-input>
        </div>

        <div class="form-group">
          <vs-input block label="Username" :loading="newStateRepsModal.verifyingUsername"
                    v-model="newStateRepsModal.payload.username"></vs-input>
        </div>

        <member-info-card :this-member="newStateRepsModal.stateRepMember"></member-info-card>

      </div>

      <template #footer>
        <div class="footer-dialog">
          <vs-button @click="makeStateRep" :disabled="!newStateRepsModal.stateRepMember" block>
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
      newStateRepsModal: {
        show: false,
        stateRepMember: null,
        verifyingUsername: false,
        payload: {
          username: '',
          state: '',
        }
      }
    }
  },
  async fetch(){
    await this.getMembersList();
  },
  methods: {
    async checkMember(username) {
      this.newStateRepsModal.stateRepMember = null;
      this.newStateRepsModal.verifyingUsername = true;

      let response = await this.$axios.get("/members/check/" + username, {
        params: {
          withSuggestions: false
        }
      });

      const data = response.data;
      this.newStateRepsModal.verifyingUsername = false;

      if(data.member === undefined){
        this.$vs.notification({
          text: 'No member identified as state-rep',
          position: 'top-center',
          color: 'danger'
        })
        return ;
      }

      this.newStateRepsModal.stateRepMember = data.member;
    },
    async makeStateRep(){
      this.shouldRefresh = false;

      await this.$doTask(async () => {
        let response = await this.$axios.post('members/state_reps/add', {
          username: this.newStateRepsModal.payload.username,
          state: this.newStateRepsModal.payload.state
        });

        this.shouldRefresh = true;
        this.newStateRepsModal.show = false;
      });
    },
    async removeStateRep(username){
      if(!confirm('Are you sure?')) return ;

      this.shouldRefresh = false;

      await this.$doTask(async () => {
        let response = await this.$axios.post('members/state_reps/remove', {
          username: username
        });

        this.shouldRefresh = true;
      });
    },
    async getMembersList(){
      await this.$doTask(async ()=>{
        let response = await this.$axios.$get('members/state_reps', {
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
    'newStateRepsModal.payload.username': _.debounce(function(username){
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
