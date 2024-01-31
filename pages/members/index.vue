<template>
  <div class="row" ref="members-list">
    <div class="col-12">
      <div class="row mb-3">
        <div class="col-12 d-flex justify-content-between">
          <h3 class="display-4">Members</h3>
          <vs-button
            @click="$router.push('/members/new')"
            size="large"
            active
            success
            square
            v-authorization="permissions.RegisterNewMember"
          >
            <i class="mdi mdi-plus"></i>
            New Member
          </vs-button>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card">
            <div
              class="card-body d-flex justify-content-between align-items-center"
            >
              <div class="d-flex align-self-center" v-if="totalPages > 0">
                <span class="align-self-center badge badge-info">
                  Page: <b>{{ page }}</b> of {{ totalPages }}
                </span>
              </div>

              <div class="">
                <div class="btn-group btn-group-sm">
                  <button
                    class="btn btn-sm btn-outline-primary"
                    @click="showSearchDialog = !showSearchDialog"
                    data-toggle="modal"
                    data-target="#searchModal"
                  >
                    <i class="mdi mdi-account-search"></i>
                    Search...
                  </button>
                  <button
                    v-show="
                      searchData.username || searchData.name || searchData.stage
                    "
                    class="btn btn-danger"
                    @click="resetSearch"
                  >
                    <i class="bx bxs-x-square"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="table-responsive">
              <table
                class="table table-hover table-condensed"
                style="table-layout: initial"
              >
                <thead class="">
                  <tr>
                    <th style="width: 5px"></th>
                    <th></th>
                    <th>Name</th>
                    <th>Branch / Country</th>
                    <th>Phone</th>
                    <th>Sponsor</th>
                    <th>Up-Line</th>
                    <th style="width: 20px"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    style="cursor: pointer"
                    :key="index"
                    :class="{
                      'text-danger': member.status === 'inactive',
                      'text-warning': member.status === 'pending',
                      'text-muted': member.status === 'muted',
                    }"
                    v-for="(member, index) in $store.state.members.members"
                  >
                    <td>{{ index + 1 }}</td>
                    <td>
                      <vs-avatar
                        class="d-inline-block"
                        :warn="member.pending"
                        :danger="member.inActive"
                        :dark="member.muted"
                        :success="member.active"
                        size="35"
                      >
                        <template #text v-if="!member.avatar">
                          {{ member.full_name }}
                        </template>

                        <img :src="member.avatar" v-if="member.avatar" alt="" />
                      </vs-avatar>
                    </td>
                    <td>
                      <span class="font-weight-semibold">{{
                        member.full_name
                      }}</span>
                      <br />
                      <span>{{ member.user.username }}</span>
                    </td>
                    <td>
                      {{ member.branch.name }} / <br />
                      {{ member.domain.country.name }}
                    </td>
                    <td>{{ member.phone }}</td>
                    <td>
                      <div v-if="member.sponsor_member">
                        {{ member.sponsor_member.full_name }} / <br />
                        {{ member.sponsor_member.user.username }}
                      </div>
                    </td>
                    <td>
                      <div v-if="member.up_line_member">
                        {{ member.up_line_member.full_name }} / <br />
                        {{ member.up_line_member.user.username }}
                      </div>
                    </td>
                    <td>
                      <vs-button
                        blank
                        @click="
                          $router.push(
                            '/members/' + member.user.username + '/details'
                          )
                        "
                      >
                        <i class="bx bx-show"></i>
                        view
                      </vs-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="col-12 mt-4" v-if="$store.state.members.totalPages">
          <vs-pagination
            v-model="page"
            :length="$store.state.members.totalPages"
          />
        </div>
      </div>
    </div>
    <member-search-dialog
      @closed="showSearchDialog = false"
      :show="showSearchDialog"
    ></member-search-dialog>
  </div>
</template>

<script>
import { Permissions } from "@/utils/permissions";
import MemberSearchDialog from "~/components/MemberSearchDialog";

export default {
  name: "index",
  components: { MemberSearchDialog },
  layout: "app",
  data() {
    return {
      page: 1,
      showSearchDialog: false,
    };
  },
  async fetch() {
    await this.getMembersList();
  },
  methods: {
    async getMembersList() {
      await this.$doTask(
        async () => {
          await this.$store.dispatch("members/fetchMembers");
        },
        "Fetching members...",
        this.$refs["members-list"]
      );
    },
    async resetSearch() {
      await this.$doTask(
        async () => {
          await this.$store.dispatch("members/resetSearchQuery");
        },
        "Fetching members...",
        this.$refs["members-list"]
      );
    },
  },
  watch: {
    page: async function (_, __) {
      await this.$store.commit("members/setPageNumbers", this.page);

      await this.getMembersList();
    },
  },
  computed: {
    searchData() {
      return this.$store.state.members.search;
    },
    totalPages() {
      return this.$store.state.members.totalPages;
    },
    permissions() {
      return Permissions;
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
div.vs-card {
  max-width: 100% !important;
}
</style>
