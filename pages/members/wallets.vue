<template>
  <div class="row" ref="members-wallet-list">
    <div class="col-12">
      <div class="row">
        <div class="col-12">
          <h5 class="display-4">Members' Wallet</h5>

          <div
            class="d-flex flex-nowrap row"
            style="overflow-x: auto; min-height: 150px"
            ref="member-wallet-stat"
          >
            <div class="col border-left">
              <div class="card" style="min-width: 230px">
                <div class="card-body">
                  <div class="d-flex align-items-center justify-content-center">
                    <div class="wrapper">
                      <p
                        class="card-text mb-0 text-center text-info"
                        style="white-space: nowrap"
                      >
                        Total Members
                      </p>
                      <div class="fluid-container">
                        <h3 class="card-title text-center mb-0">
                          {{ totalMembers | number }}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col border-left">
              <div class="card" style="min-width: 230px">
                <div class="card-body">
                  <div class="d-flex align-items-center justify-content-center">
                    <div class="wrapper">
                      <p
                        class="card-text mb-0 text-success text-center"
                        style="white-space: nowrap"
                      >
                        Total Limit
                      </p>
                      <div class="fluid-container">
                        <h3 class="card-title text-center mb-0">
                          {{ totalLimit | number }}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col border-left">
              <div class="card" style="min-width: 230px">
                <div class="card-body">
                  <div class="d-flex align-items-center justify-content-center">
                    <div class="wrapper">
                      <p
                        class="card-text text-center text-primary mb-0"
                        style="white-space: nowrap"
                      >
                        Total Balance
                      </p>
                      <div class="fluid-container">
                        <h3 class="card-title text-center mb-0">
                          {{ totalBalance | number }}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card card-body">
            <div class="d-flex justify-content-between">
              <div class="d-flex grid-margin" v-if="totalPages">
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
                    v-show="searchData.username"
                    class="btn btn-danger"
                    @click="resetSearch"
                  >
                    <i class="bx bxs-x-square"></i>
                  </button>
                  <wallet-search-dialog
                    @closed="showSearchDialog = false"
                    :show="showSearchDialog"
                  ></wallet-search-dialog>
                </div>
              </div>
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
                    <th>Username</th>
                    <th>Limit</th>
                    <th>Balance</th>
                    <th style="width: 20px"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    style="cursor: pointer"
                    v-for="(member, index) in membersWithWallet"
                  >
                    <td>{{ index + 1 }}</td>
                    <td>
                      <span class="font-weight-semibold">{{
                        member.full_name
                      }}</span>
                    </td>
                    <td>
                      <span>{{ member.user.username }}</span>
                    </td>
                    <td>{{ member.auto_withdraw_amount | money }}</td>
                    <td class="font-weight-bold">
                      {{ parseFloat(member.wallet_balance) | money }}
                    </td>
                    <td>
                      <vs-button
                        blank
                        @click="
                          $router.push(
                            '/members/' + member.user.username + '/details'
                          )
                        "
                      >
                        <i class="bx bx-show"></i>
                        view dashboard
                      </vs-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import WalletSearchDialog from "~/components/WalletSearchDialog";

export default {
  name: "wallets",
  components: { WalletSearchDialog },
  layout: "app",
  data() {
    return {
      totalPages: 1,
      page: 1,
      pagination: null,
      showSearchDialog: false,
      searchPayload: null,
    };
  },
  methods: {
    async getMembersWithWalletList() {
      await this.$doTask(
        async () => {
          await this.$store.dispatch("members/fetchMembersWithWallet");
        },
        "Loading members with wallet...",
        this.$refs["members-wallet-list"]
      );
    },
    async getMemberWalletStatistics() {
      await this.$doTask(
        async () => {
          await this.$axios.get("members/wallet/data/stats");
        },
        "Loading...",
        this.$refs["member-wallet-stat"]
      );
    },
    async resetSearch() {
      await this.$doTask(
        async () => {
          await this.$store.dispatch("members/resetSearchQuery");
        },
        "Loading members with wallet...",
        this.$refs["members-wallet-list"]
      );
    },
  },
  watch: {
    page: async function (_, __) {
      await this.$store.commit("members/setPageNumbers", this.page);

      await this.getMembersWithWalletList();
    },
  },
  mounted() {
    this.getMembersWithWalletList();
  },
  computed: {
    membersWithWallet() {
      return this.$store.state.members.membersWithWallet;
    },
    totalMembers() {
      return this.membersWithWallet.length;
    },
    totalLimit() {
      return _.sumBy(this.membersWithWallet, "auto_withdraw_amount");
    },
    totalBalance() {
      return _.sumBy(this.membersWithWallet, (item) => {
        return parseFloat(item.wallet_balance);
      });
    },
    searchData() {
      return this.$store.state.members.search;
    },
  },
};
</script>

<style lang="scss" scoped></style>
