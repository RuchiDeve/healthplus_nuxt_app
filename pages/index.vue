<template>
  <component
    :is="dashBoardComponent"
    v-bind="dashboardComponentProperties"
  ></component>
</template>

<script>
import StaffDashboard from "@/components/dashboard/StaffDashboard";
import MemberDetails from "@/pages/members/_username/details";
import PartnerDetails from "@/pages/partners/_id/details";
import SupplierDetails from "@/pages/suppliers/_id/details";
import details from "@/pages/branches/_branchId/details";
import AssignedBranches from "@/pages/branches/_branchId/assigned";

export default {
  components: {
    MemberDetails,
    StaffDashboard,
    PartnerDetails,
    SupplierDetails,
    details,
    AssignedBranches,
  },
  layout: "app",
  middleware({}) {},
  data: () => ({}),
  created() {},
  computed: {
    dashBoardComponent() {
      if (this.$root.authMember) {
        return "member-details";
      } else if (this.$root.authPartner) {
        return "partner-details";
      } else if (this.$root.authSupplier) {
        return "supplier-details";
      } else if (this.$root.authBranchAdmin) {
        return "assigned-branches";
      }
      return "staff-dashboard";
    },
    dashboardComponentProperties() {
      if (this.$root.authMember) {
        return {
          "default-member": this.$root.authMember,
        };
      } else if (this.$root.authPartner) {
        return {
          "default-partner": this.$root.authPartner,
        };
      } else if (this.$root.authSupplier) {
        return {
          "default-supplier": this.$root.authSupplier,
        };
      }
      return {};
    },
  },
};
</script>

<style></style>
