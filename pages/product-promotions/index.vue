<template>
  <product-promotions admin></product-promotions>
</template>

<script>
import Helpers from "@/utils/helpers";
import { Permissions } from "@/utils/permissions";
import _ from "lodash";
import ProductPromotions from '@/components/ProductPromotions'

export default {
  name: "AllProductPromotions",
  layout: "app",
  middleware() {
    Helpers.authorize(Permissions.All);
  },
  components: {
    ProductPromotions
  },
};
</script>

<style scoped></style>
