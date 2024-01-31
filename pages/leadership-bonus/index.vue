<template>

  <div class="row">
    <div class="col-12">
      <div class="row mt-2 mb-3">
        <div class="col-12 d-flex justify-content-between">
          <h3 class="display-4">Leadership Bonus</h3>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card card-body" ref="supplies-list" style="min-height: 300px">
            <div class="d-flex grid-margin" v-if="pagination">
              <vs-pagination only-arrows v-model="page" :length="totalPages" />
              <span class="align-self-center badge badge-info">
                    Page: <b>{{ page }}</b>
                  </span>
            </div>
            <div class="table-responsive">
              <table class="table table-condensed table-hover">
                <thead>
                <tr>
                  <td></td>
                  <td>Country</td>
                  <td>Month/Year</td>
                  <td>Stage</td>
                  <td>Amount</td>
                  <td>Amount per<br>Qualifier</td>
                  <td>Status</td>
                  <td>Date</td>
                  <td></td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(bonus, index) in leadershipBonuses" :key="index"
                :class="{'text-warning': bonus.status === 'Pending'}">
                  <td>{{index + 1}}</td>
                  <td>{{bonus.country.name}}</td>
                  <td>{{bonus.month_year}}</td>
                  <td>{{bonus.stage.name}}</td>
                  <td>{{bonus.total_bonus_amount | money}}</td>
                  <td>{{bonus.amount_to_receive_per_qualifier | money}}</td>
                  <td>
                    <span class="badge" :class="{'badge-warning': !bonus.paid,
                    'badge-success': bonus.paid}">
                      {{bonus.status}}
                    </span>
                  </td>
                  <td>
                    <span v-if="bonus.paid">
                      {{bonus.paid_at | date}}
                    </span>
                  </td>
                  <td>
                    <vs-button primary flat size="small" @click="viewQualifiers(bonus)">
                      View Qualifiers
                    </vs-button>
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

    <vs-dialog v-model="leadershipDetailsModal.show" auto-width
               @close="leadershipDetailsModal.show = false">
      <template #header>
        <h4 class="">Bonus Qualifiers</h4>
      </template>

      <div class="mt-3 table-responsive" style="max-height: 600px; overflow-y: auto">
        <div class="d-flex justify-content-between mb-4" style="min-width: 400px;" v-if="selectedBonus">
          <div class="d-flex flex-column justify-content-center">
            <p class="card-text font-weight-bold mb-0" style="white-space: nowrap">
              Total Amount
            </p>
            <div class="fluid-container">
              <h5 class="card-title text-primary mb-0">
                <i class="mdi mdi-currency-ngn"></i>
                {{ selectedBonus.total_bonus_amount | money }}
              </h5>
            </div>

          </div>

          <div class="d-flex flex-column justify-content-center">
            <p class="card-text font-weight-bold mb-0" style="white-space: nowrap">
              Earnings per Member
            </p>
            <div class="fluid-container">
              <h5 class="card-title text-success mb-0">
                <i class="mdi mdi-currency-ngn"></i>
                {{ selectedBonus.amount_to_receive_per_qualifier | money }}
              </h5>
            </div>
          </div>

          <div class="d-flex flex-column justify-content-center">
            <p class="card-text font-weight-bold mb-0" style="white-space: nowrap">
              Total Qualifiers
            </p>
            <div class="fluid-container">
              <h5 class="card-title text-primary mb-0">
                {{ selectedBonus.qualifier_member_ids.length | number }}
              </h5>
            </div>
          </div>
        </div>
        <table class="table table-condensed" v-if="selectedBonus">
          <tbody>
          <tr v-for="(member, index) in bonusQualifiers.data" :key="index">
            <td>{{index + 1}}</td>
            <td>
              <vs-avatar class="d-inline-block" :warn="member.pending" :danger="member.status === 'inactive'"
                         :dark="member.muted"
                         :success="member.active" size="35">
                <template #text v-if="!member.avatar">
                  {{ member.full_name }}
                </template>

                <img :src="$backendFiles(member.avatar)" v-if="member.avatar" alt="">
              </vs-avatar>
            </td>
            <td>
              <h5 class="mb-0">{{member.full_name}}</h5>
              <p class="mb-0">{{member.user.username}}</p>
            </td>
            <td>
              <p class="mb-1">{{member.bank_details.bank_name}}</p>
              <p class="mb-0 font-weight-bold">{{member.bank_details.bank_account_number}}</p>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <template #footer>
        <div class="row pt-5" v-if="selectedBonus && !selectedBonus.paid">
          <div class="col-md-6">
            <div class="form-group">
              <vs-input block label="Date of Payment"
                        v-model="leadershipDetailsModal.paidDate"
                        aria-required="true" primary active type="date" />
            </div>
          </div>
          <div class="col-md-6">
            <vs-button block success active
                       @click="markPaid"
                       :disabled="!leadershipDetailsModal.paidDate">
              <i class="mdi mdi-check-circle"></i>
              Mark As Paid
            </vs-button>
          </div>
        </div>
      </template>
    </vs-dialog>

  </div>

</template>

<script>
export default {
  name: "LeadershipBonusIndex",
  layout: "app",
  data: () => ({
    page: 1,
    totalPages: 0,
    pagination: null,
    leadershipBonuses: [],
    selectedBonus: null,
    leadershipDetailsModal: {
      show: false,
      loading: false,
      paidDate: null,
    },
    bonusQualifiers: {
      data: [],
      loading: false,
    }
  }),
  methods: {
    async getLeadershipBonuses(){
      await this.$doTask(async () => {
        let response = await this.$axios.$get('leadership-bonuses', {
          params: {
            page: this.page
          }
        });
        this.leadershipBonuses = response.data;
        this.totalPages = response.last_page;
      }, 'Fetching Leadership Bonuses');
    },
    async viewQualifiers(bonus){
      this.selectedBonus = bonus;
      this.leadershipDetailsModal.show = true;
      await this.getQualifiers(bonus);
    },
    async markPaid(){
      await this.$doTask(async () => {
        await this.$axios.post('leadership-bonuses/mark-paid', {
          id: this.selectedBonus.id,
          date: this.leadershipDetailsModal.paidDate
        });
        this.selectedBonus.paid = true;
        await this.getLeadershipBonuses();
      });
    },
    async getQualifiers(bonus){
      this.bonusQualifiers.loading = true;

      this.bonusQualifiers.data = [];

      this.bonusQualifiers.data = await this.$axios.$get('leadership-bonuses/' + bonus.id + '/qualifiers');

      this.bonusQualifiers.loading = false;
    }
  },
  mounted() {
    this.getLeadershipBonuses();
  },
  watch: {
    page(__, ___){
      this.getLeadershipBonuses();
    }
  }
}
</script>

<style scoped>

</style>
