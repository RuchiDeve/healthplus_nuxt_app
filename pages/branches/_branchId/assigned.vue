<template>
  <div class="row" ref="branches-list">
    <div class="col-12">
      <div class="row mb-3">
        <div class="col-12 d-flex justify-content-between">
          <h3 class="display-4">Assigned Branches</h3>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card">
            <div
              class="card-body d-flex justify-content-between align-items-center"
            >
              <div class="d-flex align-self-center" v-if="totalPages">
                <vs-pagination
                  only-arrows
                  v-model="page"
                  :length="totalPages"
                />
                <span class="align-self-center badge badge-info">
                  Page: <b>{{ page }}</b> of {{ totalPages }}
                </span>
              </div>

              <!-- <div class="">
                <button
                  class="btn btn-sm btn-outline-primary"
                  @click="showSearchDialog = !showSearchDialog"
                  data-toggle="modal"
                  data-target="#searchModal"
                >
                  <i class="mdi mdi-account-search"></i>
                  Search...
                </button>
              </div> -->

              <!-- <vs-button
                danger
                class="align-self-center"
                v-show="shouldResetSearchDialog"
                circle
                size="small"
                icon
                @click="resetSearch"
              >
                <i class="bx bxs-x-square"></i>
              </vs-button> -->
            </div>

            <div class="table-responsive">
              <table
                class="table table-hover table-condensed"
                style="table-layout: initial"
              >
                <thead class="">
                  <tr>
                    <th style="width: 5px"></th>
                    <th>Name</th>
                    <th>Account / Bank</th>
                    <th>Address</th>
                    <th>Country</th>
                    <th style="width: 40px"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    style="cursor: pointer"
                    :key="index"
                    v-for="(branch, index) in branches"
                  >
                    <td>{{ index + 1 }}</td>
                    <td>
                      <span class="font-weight-semibold">{{
                        branch.name
                      }}</span>
                    </td>
                    <td>{{ branch.account_number }} / {{ branch.bank }}</td>
                    <td>{{ branch.address }}</td>
                    <td>{{ branch.country.name }}</td>
                    <td>
                      <a
                        class="btn btn-inverse-dark btn-xs"
                        href="javascript:void(0)"
                        @click="
                          $router.push('/branches/' + branch.id + '/details')
                        "
                      >
                        <i class="bx bxs-dashboard"></i>
                        view
                      </a>
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
  </div>
</template>

<script>
export default {
  name: "assigned",
  layout: "app",
  data() {
    return {
      // shouldRefresh: false,
      page: 1,
      // showSearchDialog: false,
      branches: [],
      pagination: null,
      totalPages: 1,
      // search: {
      //   username: null,
      //   name: null,
      //   stage: null,
      // },
    };
  },
  methods: {
    async getAssignedBranches() {
      try {
        this.branches = await this.$axios.$get(`/branches/get-assigned-branch`);
      } catch (e) {
        console.log("Failed to get assigned branches", e.response);
      }
    },
  },
  mounted() {
    this.getAssignedBranches();
  },
};
</script>
