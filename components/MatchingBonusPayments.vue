<template>
  <div class="row">
    <div class="col-12">
      <div class="row mt-5 mb-3">
        <div class="col-12 col-lg-7">
          <h4 class="card-title mb-0">Matching Bonuses</h4>
          <p class="text-small text-muted">
            View list of all matching bonuses.
          </p>
        </div>
        <div class="col-12 col-lg-5">
          <vs-input
            icon-after
            block
            placeholder="Search"
            type="search"
            v-model="search"
            @input="getMatchingBonusPayments"
          >
            <template #icon>
              <i class="bx bx-search"></i>
            </template>
          </vs-input>
        </div>
      </div>
      <div class="table-responsive card card-body">
        <table class="table table-hover table-condensed table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Donor</th>
              <th>Bonus</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in matchingBonusPayments" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                {{ item.created_at | date }}
              </td>
              <td>
                {{ item.donor.user.username }}
              </td>
              <td>
                {{
                  item.amount | money
                }}
              </td>
              <td :class="item.paid ? 'text-success' : 'text-danger'">
                {{ item.paid ? "Paid" : "Unpaid" }}
              </td>
            </tr>
            <tr v-if="matchingBonusPayments.length === 0">
              <td colspan="7" class="text-center">
                No matching bonuses found
              </td>
            </tr>
          </tbody>
        </table>

        <div class="pt-4" v-if="totalPages">
          <vs-pagination
            v-model="page"
            :length="totalPages"
            @input="getMatchingBonusPayments"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MatchingBonusPayments",
  props: {
    member: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      matchingBonusPayments: [],
      page: 1,
      totalPages: 1,
      search: "",
    };
  },
  mounted() {
    this.getMatchingBonusPayments();
  },
  methods: {
    getMatchingBonusPayments: _.debounce(async function () {
      await this.$doTask(async () => {
        let params = {
          page: this.page,
          "filter[member-id]": this.member.id,
          "filter[search]": this.search,
        };

        const response = await this.$repositories.matchingBonusPayments.index(
          params
        );
        this.matchingBonusPayments = response.data;
        this.totalPages = response.last_page;
      }, "Loading...");
    }, 500),
  },
};
</script>

<style scoped></style>
