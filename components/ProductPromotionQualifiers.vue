<template>
  <div class="row">
    <div class="col-12">
      <div class="row mt-5 mb-3">
        <div class="col-12 col-lg-7">
          <h4 class="card-title mb-0">Qualifiers</h4>
        </div>
        <div class="col-12 col-lg-5">
        </div>
      </div>
      <div class="table-responsive card card-body">
        <table class="table table-hover table-condensed table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Buyers</th>
              <th>CPT Ordered</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in qualifiers" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                {{ item.member.username }}
              </td>
              <td>
                {{
                  (item.amount / item.product_promotion.amount_per_cpt) | number
                }}
              </td>
              <td>{{ item.amount | money }}</td>
            </tr>
            <tr v-if="qualifiers.length === 0">
              <td colspan="7" class="text-center">
                No product promotion qualifiers found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductPromotionQualifiers",
  props: {
    qualifiers: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
    };
  },
};
</script>

<style scoped></style>
