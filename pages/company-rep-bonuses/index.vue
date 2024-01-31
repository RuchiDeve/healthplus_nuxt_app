<template>
  <company-rep-bonuses></company-rep-bonuses>
</template>

<script>
import Helpers from "@/utils/helpers";
import { Permissions } from "@/utils/permissions";
import _ from "lodash";
import CompanyRepBonuses from '@/components/CompanyRepBonuses'

export default {
  name: "AdminCompanyRepBonuses",
  layout: "app",
  middleware() {
    Helpers.authorize(Permissions.All);
  },
  components: {
    CompanyRepBonuses
  },
};
</script>

<style scoped></style>
