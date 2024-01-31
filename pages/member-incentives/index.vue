<template>
  <div class="row">
    <div class="col-12">
      <div class="d-flex justify-content-between mt-5 mb-3">
        <h4 class="display-4">Member Incentives</h4>
      </div>

      <div class="row">
        <div class="col-12">
          <div
            class="card card-body"
            ref="incentives-list"
            style="min-height: 300px"
          >
            <div class="d-flex justify-content-between">
              <div class="d-flex grid-margin" v-if="totalPages">
                <!--              <vs-pagination only-arrows v-model="page" :length="totalPages" />-->
                <span class="align-self-center badge badge-info">
                  Page: <b>{{ page }} of {{ totalPages }}</b>
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
                    v-show="searchPayload !== null"
                    class="btn btn-danger"
                    @click="resetSearch"
                  >
                    <i class="bx bxs-x-square"></i>
                  </button>
                </div>
                <incentive-search-dialog
                  @closed="showSearchDialog = false"
                  :show="showSearchDialog"
                  @search="searchIncentive($event)"
                ></incentive-search-dialog>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-hover table-condensed">
                <thead>
                  <tr>
                    <th style="width: 5px"></th>
                    <th style="width: 10px"></th>
                    <th>Member</th>
                    <th>Incentive</th>
                    <th>Date Qualified</th>
                    <th>Status</th>
                    <th>Issue Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(incentive, index) in incentives" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>
                      <vs-avatar class="d-inline-block" dark size="35">
                        <template #text v-if="!incentive.member.avatar">
                          {{ incentive.member.full_name }}
                        </template>

                        <img
                          :src="incentive.member.avatar"
                          v-if="incentive.member.avatar"
                          alt=""
                        />
                      </vs-avatar>
                    </td>
                    <td>
                      <span class="font-weight-semibold">{{
                        incentive.member.full_name
                      }}</span>
                      <br />
                      <span>{{ incentive.member.user.username }}</span>
                    </td>
                    <td>{{ incentive.incentive_requirement_schedule.name }}</td>
                    <td>{{ incentive.created_at | date }}</td>
                    <td>
                      <span
                        class="badge"
                        :class="{
                          'badge-warning': !incentive.issued,
                          'badge-success': incentive.issued,
                        }"
                      >
                        {{ incentive.issued ? "ISSUED" : "PENDING" }}
                      </span>
                    </td>
                    <td>
                      <span class="" v-if="incentive.issued">
                        {{ incentive.issued_at | date }}
                      </span>
                    </td>
                    <td>
                      <div class="d-flex align-items-center">
                        <div v-if="!incentive.issued">
                          <vs-button
                            size="small"
                            success
                            @click="confirmIncentive(incentive)"
                          >
                            <i class="ti-check"></i>
                            confirm
                          </vs-button>
                        </div>
                        <vs-button
                          blank
                          active
                          primary
                          size="small"
                          :href="
                            '/members/' +
                            incentive.member.user.username +
                            '/details'
                          "
                        >
                          <i class="ti-eye"></i>
                          Show member
                        </vs-button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="col-12 mt-4" v-if="totalPages">
            <vs-pagination v-model="page" :length="totalPages" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IncentiveSearchDialog from "~/components/IncentiveSearchDialog";

export default {
  name: "index",
  components: { IncentiveSearchDialog },
  layout: "app",
  data() {
    return {
      incentives: [],
      totalPages: 1,
      page: 1,
      pagination: null,
      showSearchDialog: false,
      searchPayload: null,
    };
  },
  methods: {
    async getIncentives() {
      await this.$doTask(async () => {
        let response = await this.$axios.$get("incentives", {
          params: {
            page: this.page,
            ...this.searchPayload,
          },
        });

        this.incentives = response.data;
        this.totalPages = response.last_page;
      }, "Fetching incentives");
    },
    async confirmIncentive(incentive) {
      if (!confirm("Are you sure?")) return;

      await this.$doTask(async () => {
        let response = await this.$axios.post(
          "incentives/confirm/" + incentive.id
        );
        console.log("confirmed", response.data);
      }, "Confirming...");

      incentive.issued = true;
      window.location.reload();
    },
    searchIncentive(payload) {
      this.searchPayload = payload;
      this.getIncentives();
    },
    resetSearch() {
      this.searchPayload = null;
      this.getIncentives();
    },
  },
  mounted() {
    this.getIncentives();
  },
  watch: {
    page(__, ___) {
      this.getIncentives();
    },
  },
};
</script>

<style scoped></style>
