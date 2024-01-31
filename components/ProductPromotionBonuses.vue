<template>
  <div class="row">
    <div class="col-12">
      <div class="row mt-5 mb-3">
        <div class="col-12 col-lg-7">
          <h4 class="card-title mb-0">Product Promotion Bonuses</h4>
          <p class="text-small text-muted">
            View list of all product promotion bonuses.
          </p>
        </div>
        <div class="col-12 col-lg-5">
          <vs-input
            icon-after
            block
            placeholder="Search"
            type="search"
            v-model="search"
            @input="getProductPromotionBonuses"
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
              {{ (member.paid_total_product_promotion_bonuses || 0) | money }}
            </span>
          </h5>
        </div>
      </div>
      <div class="table-responsive card card-body">
        <table class="table table-hover table-condensed table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>CPT Ordered</th>
              <th>Date Confirmed</th>
              <th>Request Pin</th>
              <th>Bonus</th>
              <th>Date Paid</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in productPromotionBonuses" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                {{ item.product.name }}
              </td>
              <td>
                {{
                  (item.amount / item.product_promotion.amount_per_cpt) | number
                }}
              </td>
              <td>{{ item.order.confirmed_at | date }}</td>
              <td>
                {{ item.order.member_product_request.request_pin }}
              </td>
              <td>{{ item.amount | money }}</td>
              <td>{{ item.order.paid_at | date }}</td>
              <td :class="item.status ? 'text-success' : 'text-danger'">
                {{ item.status ? "Active" : "Inactive" }}
              </td>
            </tr>
            <tr v-if="productPromotionBonuses.length === 0">
              <td colspan="7" class="text-center">
                No product promotion bonuses found
              </td>
            </tr>
          </tbody>
        </table>

        <div class="pt-4" v-if="totalPages">
          <vs-pagination
            v-model="page"
            :length="totalPages"
            @input="getProductPromotionBonuses"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductPromotionBonuses",
  props: {
    member: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      productPromotionBonuses: [],
      page: 1,
      totalPages: 1,
      search: "",
    };
  },
  mounted() {
    this.getProductPromotionBonuses();
  },
  methods: {
    getProductPromotionBonuses: _.debounce(async function () {
      await this.$doTask(async () => {
        let params = {
          page: this.page,
          "filter[member_id]": this.member.id,
          "filter[search]": this.search,
        };

        const response = await this.$repositories.productPromotionBonuses.index(
          params
        );
        this.productPromotionBonuses = response.data;
        this.totalPages = response.last_page;
      }, "Loading...");
    }, 500),
  },
};
</script>

<style scoped></style>
