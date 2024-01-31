<template>

  <div class="card card-body">
    <h5 class="card-title">Order Confirmations</h5>
    <p class="card-subtitle">Orders confirmed by workers in the last 7-days</p>

    <div class="table-responsive" style="height: 300px; overflow-y: auto;" ref="confirmation-data-stats">
      <table class="table table-condensed table-hover" v-if="confirmationsData.length">
        <thead>
        <tr>
          <th>SN</th>
          <th>Confirmed by</th>
          <th>Total Confirmations</th>
          <th>Total Points</th>
          <th>Total Amount</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(confirmation, index) in confirmationsData" :key="index">
          <td>{{index + 1}}</td>
          <td>{{confirmation.confirmed_by_username}}</td>
          <td>{{confirmation.total_confirmations | number}}</td>
          <td>{{confirmation.total_points_confirmed | number}}</td>
          <td>{{confirmation.total_amount_confirmed | money}}</td>
          <td>
<!--            <vs-button flat dark size="small" @click="showConfirmationDetails(confirmation)">-->
<!--              more...-->
<!--            </vs-button>-->
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <vs-dialog v-model="confirmationDetailsModal.show" auto-width
               @close="confirmationDetailsModal.show = false">
      <template #header>
        <h4 class="" v-if="confirmationDetailsModal.confirmation">
          Confirmed by: {{confirmationDetailsModal.confirmation.confirmed_by_username}}
        </h4>
      </template>

      <div class="mt-3 table-responsive" style="max-height: 400px; overflow-y: auto">
        <div class="d-flex flex-column mb-4" v-if="confirmationDetailsModal.confirmation">

          <div class="d-flex flex-column">
            <p class="card-text font-weight-bold mb-0" style="white-space: nowrap">
              Total Confirmations
            </p>
            <div class="fluid-container">
              <h5 class="card-title text-primary mb-0">
                {{ confirmationDetailsModal.confirmation.totalConfirmations | number }}
              </h5>
            </div>
          </div>

        </div>

        <table class="table table-condensed" v-if="confirmationDetailsModal.confirmation">
          <tbody>
          <tr v-for="(orderNumber, index) in confirmationDetailsModal.orderNumbers" :key="index">
            <td>{{index + 1}}</td>
            <td>
              <a href="">
                {{orderNumber}}
              </a>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

    </vs-dialog>

  </div>

</template>

<script>
import _ from 'lodash';

export default {
  name: "OrderConfirmationsDataStatistics",
  data: () => ({
    confirmationsData: [],
    filter: 'weekly',
    confirmationDetailsModal: {
      show: false,
      confirmation: null,
      orderNumbers: [],
    }
  }),
  methods: {
    async fetchConfirmationsDataStatistics(){
      await this.$doTask(async () => {
        let response = await this.$axios.get('reports/orders/confirmations', {
          params: {

          }
        });
        this.confirmationsData = response.data;
      }, 'Loading...', this.$refs["confirmation-data-stats"])
    },
    showConfirmationDetails(confirmation){
      this.confirmationDetailsModal.confirmation = confirmation;

      this.confirmationDetailsModal.orderNumbers = _.split(confirmation.confirmedOrderNumbers, ',');

      console.log('order numbers', this.confirmationDetailsModal.orderNumbers);

      this.confirmationDetailsModal.show = true;
    }
  },
  mounted() {
    this.fetchConfirmationsDataStatistics();
  }
}
</script>

<style scoped>

</style>
