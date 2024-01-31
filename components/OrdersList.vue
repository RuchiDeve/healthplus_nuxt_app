<template>

  <div class="table-responsive" v-if="orders.length">
    <table class="table table-condensed table-hover">
      <thead class="">
      <tr>
        <th style="width: 5px;"></th>
        <th v-if="showBuyer">Buyer</th>
        <th v-if="showPayer">Payer</th>
        <th>Payment<br>Reference</th>
        <th>C.Pts</th>
        <th>Amount</th>
        <th>Reg. Fee</th>
        <th>Channel</th>
        <th>Date</th>
        <th style="width: 20px;"></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(order, index) in orders" :key="order.id"
      :class="{'text-warning': !order.confirmed}">
        <td>{{index + 1}}</td>
        <td v-if="showBuyer">
          {{order.buyer_member.full_name}}
          <br>
          <small>{{order.buyer_member.user.username}}</small>
        </td>
        <td v-if="showPayer">
          {{order.payer_member.full_name}}
          <br>
          <small>{{order.payer_member.user.username}}</small>
        </td>
        <td>{{order.payment_reference}}</td>
        <td>{{order.total_points | number}}</td>
        <td>{{order.total_cost | currency}}</td>
        <td>{{order.with_registration | currency}}</td>
        <td>{{order.payment_channel}}</td>
        <td>{{order.created_at | date}}</td>
        <td>
          <vs-button dark @click="$router.push('/orders/' + order.order_number + '/details')">
            <i class="bx bx-show"></i>
            view details
          </vs-button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>

</template>

<script>
export default {
  name: "OrdersList",
  data(){
    return {

    }
  },
  props: {
    orders: {
      default: [],
      type: Array
    },
    showBuyer: {
      required: false,
      default: false,
    },
    showPayer: {
      required: false,
      default: false,
    },
  }
}
</script>

<style scoped>

</style>
