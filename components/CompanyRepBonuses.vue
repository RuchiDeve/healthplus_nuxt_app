<template>
  <div class="row">
    <div class="col-12">
      <div class="row mt-5 mb-3">
        <div class="col-12 col-lg-7">
          <h4 class="card-title mb-0">Company Rep Bonuses</h4>
          <p class="text-small text-muted">
            View list of all company rep bonuses.
          </p>
        </div>
        <div class="col-12 col-lg-5">
          <vs-input
            icon-after
            block
            placeholder="Search"
            type="search"
            v-model="search"
            @input="getCompanyRepBonuses"
          >
            <template #icon>
              <i class="bx bx-search"></i>
            </template>
          </vs-input>
        </div>
        <div class="col-12">
          <h5 class="card-title mb-0 text-success">
            Total Paid Bonuses:
            <span>
              {{ (member.paid_total_company_rep_bonuses || 0) | money }}
            </span>
          </h5>
        </div>
      </div>
      <div class="table-responsive card card-body">
        <table class="table table-hover table-condensed table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th v-if="member === null">Company Rep</th>
              <th>CPT Ordered</th>
              <th>Date Confirmed</th>
              <th>Request Pin</th>
              <th>Bonus</th>
              <th>Date Paid</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in companyRepBonuses" :key="index">
              <td>{{ index + 1 }}</td>
              <td v-if="member === null">
                {{ item.member.username }}
              </td>
              <td>
                {{
                  (item.amount / item.company_rep.amount_per_cpt) | number
                }}
              </td>
              <td>{{ item.order.confirmed_at | date }}</td>
              <td>
                {{ item.order.member_product_request.request_pin }}
              </td>
              <td>{{ item.amount | money }}</td>
              <td>{{ item.order.paid_at | date }}</td>
            </tr>
            <tr v-if="companyRepBonuses.length === 0">
              <td colspan="7" class="text-center">
                No company rep bonuses found
              </td>
            </tr>
          </tbody>
        </table>

        <div class="pt-4" v-if="totalPages">
          <vs-pagination
            v-model="page"
            :length="totalPages"
            @input="getCompanyRepBonuses"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CompanyRepBonuses",
  props: {
    member: {
      type: Object,
      default(rawProps){
        return null
      },
    },
  },
  data() {
    return {
      companyRepBonuses: [],
      page: 1,
      totalPages: 1,
      search: "",
    };
  },
  mounted() {
    console.log(this);
    this.getCompanyRepBonuses();
  },
  methods: {
    getCompanyRepBonuses: _.debounce(async function () {
      await this.$doTask(async () => {
        let params = {
          page: this.page,
          "filter[search]": this.search,
        };

        if(this.member !== null){
          params["filter[member_id]"] = this.member.id
        }

        const response = await this.$repositories.companyRepBonuses.index(
          params
        );
        this.companyRepBonuses = response.data;
        this.totalPages = response.last_page;
      }, "Loading...");
    }, 500),
  },
};
</script>

<style scoped></style>
