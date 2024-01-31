<template>
  <nav class="sidebar sidebar-offcanvas noprint" id="sidebar">
    <ul class="nav">
      <li class="nav-item nav-profile">
        <div class="nav-link">
          <div class="profile-image">
            <img src="http://placehold.it/100x100" alt="image" />
            <span class="online-status online"></span>
          </div>
          <div class="profile-name">
            <p class="name">{{ $nuxt.$store.state.auth.user.username }}</p>
            <p class="designation">{{ $nuxt.$options.head.title }}</p>
          </div>
        </div>
      </li>
      <sidebar-menu-item
        link="/"
        title="Dashboard"
        css-class="mdi-monitor-dashboard"
      ></sidebar-menu-item>
      <sidebar-menu-item
        :link="
          '/members/stockists/' + $root.authMember.user.username + '/details'
        "
        v-if="$root.authMember && $root.authMember.stockiest"
        title="Stockist Dashboard"
        css-class="mdi-monitor-dashboard"
      ></sidebar-menu-item>

      <sidebar-menu-item
        v-if="$root.authMember && $root.authMember.is_state_rep"
        :link="
          '/members/state-reps/' + $root.authMember.state_rep_id + '/details'
        "
        title="State Rep. Dashboard"
        css-class="mdi-monitor-dashboard"
      ></sidebar-menu-item>

      <sidebar-menu-item
        v-authorization="permissions.ViewMembersListPage"
        link="/members"
        title="Members"
        css-class="mdi-account"
      ></sidebar-menu-item>
      <sidebar-menu-item
        v-authorization="permissions.ViewStockistsListPage"
        link="/members/stockists"
        title="Stockists"
        css-class="mdi-account"
      ></sidebar-menu-item>
      <sidebar-menu-item
        v-authorization="permissions.ViewStateRepListPage"
        link="/members/state-reps"
        title="State Reps"
        css-class="mdi-account"
      ></sidebar-menu-item>
      <sidebar-menu-item
        v-authorization="permissions.ViewOrdersListPage"
        link="/orders"
        title="Orders"
        css-class="mdi-shopping"
      ></sidebar-menu-item>
      <sidebar-menu-item
        v-authorization="permissions.ViewMembersWallet"
        link="/members/wallets"
        title="Members' Wallet"
        css-class="mdi-wallet"
      ></sidebar-menu-item>
      <sidebar-menu-item
        v-authorization="permissions.ViewDeposits"
        link="/deposits"
        title="Deposits"
        css-class="mdi-cash-register"
      ></sidebar-menu-item>
      <sidebar-menu-item
        v-authorization="permissions.ViewWithdrawals"
        link="/withdrawals"
        title="Withdrawal Requests"
        css-class="mdi-cash-register"
      ></sidebar-menu-item>

      <hr />

      <li class="nav-item">
        <a
          class="nav-link"
          data-toggle="collapse"
          href="#page-layouts"
          aria-expanded="false"
          aria-controls="page-layouts"
        >
          <i class="menu-icon mdi mdi-apps mdi-18px"></i>
          <span class="menu-title">Inventory</span>
          <i class="menu-arrow"></i>
        </a>
        <div class="collapse" id="page-layouts">
          <ul class="nav flex-column sub-menu">
            <sidebar-menu-item
            v-if="$root.authUser && ($root.authUser.is_branch_admin || $root.authUser.is_super_admin)"
              link="/inventory/branch/requests"
              title="Branch Product Req."
              css-class="mdi-cash-register"
            >
            </sidebar-menu-item>
            <sidebar-menu-item
            v-if="$root.authUser && ($root.authUser.is_branch_admin || $root.authUser.is_super_admin)"
              link="/inventory/branch/bank"
              title="Branch Product Bank"
              css-class="mdi-cash-register"
            >
            </sidebar-menu-item>
            <sidebar-menu-item
              link="/inventory/branch/issue-product"
              v-if="$root.authUser && ($root.authUser.is_branch_admin || $root.authUser.is_super_admin)"
              title="Issue Product to Stockist"
              css-class="mdi-cash-register"
            >
            </sidebar-menu-item>

            <sidebar-menu-item
              link="/inventory/stockist/requests"
              v-if="$root.authMember && $root.authMember.stockiest"
              title="Stockist Product Req."
              css-class="mdi-cash-register"
            >
            </sidebar-menu-item>
            <sidebar-menu-item
              link="/inventory/stockist/issue-product"
              v-if="$root.authMember && $root.authMember.stockiest"
              title="Issue Product to Member"
              css-class="mdi-cash-register"
            >
            </sidebar-menu-item>
            <sidebar-menu-item
              link="/inventory/stockist/bank"
              v-if="$root.authMember && $root.authMember.stockiest"
              title="Stockist Product Bank"
              css-class="mdi-cash-register"
            >
            </sidebar-menu-item>

            <sidebar-menu-item
              link="/branch-product-requests"
              title="Branch Request Pins"
              css-class="mdi-cash-register"
              v-authorization="permissions.All"
            >
            </sidebar-menu-item>
            <sidebar-menu-item
              link="/stockist-product-requests"
              title="Stockist Request Pins"
              css-class="mdi-cash-register"
              v-authorization="permissions.All"
            >
            </sidebar-menu-item>
            <sidebar-menu-item
              link="/member-product-requests"
              title="Member Request Pins"
              css-class="mdi-cash-register"
              v-authorization="permissions.All"
            >
            </sidebar-menu-item>
          </ul>
        </div>
      </li>

      <sidebar-menu-item
        v-authorization="permissions.ViewStaffsListPage"
        link="/staffs"
        title="Staffs"
        css-class="mdi-briefcase-account"
      ></sidebar-menu-item>
      <sidebar-menu-item
        v-authorization="permissions.ViewLeadershipBonus"
        link="/leadership-bonus"
        title="Leadership Bonus"
        css-class="mdi-account-box-multiple"
      ></sidebar-menu-item>
      <sidebar-menu-item
        v-authorization="permissions.ViewStateRepPayments"
        link="/state-rep-payments"
        title="State Rep Payments"
        css-class="mdi-contactless-payment"
      ></sidebar-menu-item>
      <li class="nav-item" v-authorization="permissions.ViewIncentives">
        <a
          class="nav-link"
          data-toggle="collapse"
          href="#incentives"
          aria-expanded="false"
          aria-controls="incentives"
        >
          <i class="menu-icon mdi mdi-apps mdi-18px"></i>
          <span class="menu-title">Incentives</span>
          <i class="menu-arrow"></i>
        </a>
        <div class="collapse" id="incentives">
          <ul class="nav flex-column sub-menu">
            <sidebar-menu-item
              v-authorization="permissions.ViewIncentives"
              link="/member-incentives"
              title="Member Incentives"
              css-class="mdi-gift-outline"
            ></sidebar-menu-item>
            <sidebar-menu-item
              v-authorization="permissions.All"
              link="/incentives"
              title="Manage Incentives"
              css-class="mdi-gift-outline"
            ></sidebar-menu-item>
          </ul>
        </div>
      </li>
      <sidebar-menu-item
        v-authorization="permissions.ViewPartners"
        link="/partners"
        title="Partners"
        css-class="mdi-account-box-multiple"
      ></sidebar-menu-item>
      <sidebar-menu-item
        v-authorization="permissions.ViewSupplies"
        link="/supplies"
        title="All Supplies"
        css-class="mdi-view-list"
      ></sidebar-menu-item>
      <sidebar-menu-item
        v-authorization="permissions.ViewSuppliers"
        link="/suppliers"
        title="Suppliers"
        css-class="mdi-account-box-multiple"
      ></sidebar-menu-item>
      <sidebar-menu-item
        v-authorization="permissions.ViewCurrencies"
        link="/currencies"
        title="Currencies"
        css-class="mdi-currency-ngn"
      ></sidebar-menu-item>
      <sidebar-menu-item
        v-authorization="permissions.ViewProducts"
        link="/products"
        title="Available Products"
        css-class="mdi-format-list-checks"
      ></sidebar-menu-item>
      <sidebar-menu-item
        v-authorization="permissions.ViewBranches"
        link="/branches"
        title="Branches"
        css-class="mdi-flag"
      ></sidebar-menu-item>
      <sidebar-menu-item
        v-authorization="permissions.ViewCountries"
        link="/countries"
        title="Countries"
        css-class="mdi-flag"
      ></sidebar-menu-item>

      <hr />

      <sidebar-menu-item
        v-authorization="permissions.ViewAdminExpenseData"
        link="/expense-sheet"
        title="Admin Expense Data"
        css-class="mdi-database"
      ></sidebar-menu-item>

      <sidebar-menu-item
        v-authorization="permissions.ViewSms"
        link="/sms"
        title="SMS"
        css-class="mdi-message"
      ></sidebar-menu-item>

      <sidebar-menu-item
        v-authorization="permissions.ViewRoles"
        link="/roles"
        title="Roles"
        css-class="mdi-account-group"
      ></sidebar-menu-item>

      <sidebar-menu-item
        v-authorization="permissions.All"
        link="/stage-requirement-schedules"
        title="Stage Requirement Schedules"
        css-class="mdi-source-branch"
      ></sidebar-menu-item>

      <sidebar-menu-item
        v-authorization="permissions.All"
        link="/matching-bonuses"
        title="Matching Bonuses"
        css-class="mdi-contactless-payment"
      ></sidebar-menu-item>

      <!-- <li class="nav-item" v-authorization="permissions.All">
        <a
          class="nav-link"
          data-toggle="collapse"
          href="#order-pins"
          aria-expanded="false"
          aria-controls="order-pins"
        >
          <i class="menu-icon mdi mdi-apps mdi-18px"></i>
          <span class="menu-title">Order Pins</span>
          <i class="menu-arrow"></i>
        </a>
        <div class="collapse" id="order-pins">
          <ul class="nav flex-column sub-menu">
            <sidebar-menu-item
              link="/branch-product-requests"
              title="Branch"
              css-class="mdi-ticket"
            >
            </sidebar-menu-item>
            <sidebar-menu-item
              link="/stockist-product-requests"
              title="Stockist"
              css-class="mdi-ticket"
            >
            </sidebar-menu-item>
            <sidebar-menu-item
              link="/member-product-requests"
              title="Member"
              css-class="mdi-ticket"
            >
            </sidebar-menu-item>
          </ul>
        </div>
      </li> -->

      <li class="nav-item" v-authorization="permissions.All">
        <a
          class="nav-link"
          data-toggle="collapse"
          href="#product-promotions"
          aria-expanded="false"
          aria-controls="product-promotions"
        >
          <i class="menu-icon mdi mdi-apps mdi-18px"></i>
          <span class="menu-title">Product Promotions</span>
          <i class="menu-arrow"></i>
        </a>
        <div class="collapse" id="product-promotions">
          <ul class="nav flex-column sub-menu">
            <sidebar-menu-item
              link="/product-promotions"
              title="View all"
              css-class="mdi-sale"
            >
            </sidebar-menu-item>
            <sidebar-menu-item
              link="/product-promotions/active"
              title="View active"
              css-class="mdi-sale"
            >
            </sidebar-menu-item>
          </ul>
        </div>
      </li>
      <li class="nav-item" v-authorization="permissions.All">
        <a
          class="nav-link"
          data-toggle="collapse"
          href="#company-reps"
          aria-expanded="false"
          aria-controls="company-reps"
        >
          <i class="menu-icon mdi mdi-apps mdi-18px"></i>
          <span class="menu-title">Company Reps</span>
          <i class="menu-arrow"></i>
        </a>
        <div class="collapse" id="company-reps">
          <ul class="nav flex-column sub-menu">
            <sidebar-menu-item
              link="/company-reps"
              title="View Reps"
              css-class="mdi-account-badge"
            >
            </sidebar-menu-item>
            <sidebar-menu-item
              link="/company-rep-bonuses"
              title="View Rep Bonuses"
              css-class="mdi-account-badge"
            >
            </sidebar-menu-item>
          </ul>
        </div>
      </li>

      <sidebar-menu-item
        link="/settings"
        title="Settings"
        css-class="mdi-settings"
      ></sidebar-menu-item>

      <li class="nav-item">
        <a
          class="nav-link text-danger"
          href="javascript:void(0);"
          @click="$store.dispatch('security/logout')"
        >
          <span class="menu-icon mdi mdi-18px mdi-logout"></span>
          <span class="menu-title">Sign Out</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
import SidebarMenuItem from "@/components/SidebarMenuItem";
import { Permissions } from "@/utils/permissions";
export default {
  name: "Sidebar",
  components: { SidebarMenuItem },
  methods: {},
  computed: {
    permissions() {
      return Permissions;
    },
  },
  mounted(){
    console.log('this', this)
  }
};
</script>

<style scoped></style>
