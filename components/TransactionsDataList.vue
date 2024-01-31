<template>
  <div>
    <h4 class="card-title mb-0">Transactions</h4>
    <p class="text-muted">{{description}}</p>
    <div class="table-responsive table-invoice" style="height: 450px; overflow-y: auto;">
      <table class="table table-condensed table-striped">
        <thead class="">
        <tr>
          <th class=""></th>
          <th class="">Member</th>
          <th class="text-center">Amount</th>
          <th class="text-center">Activity</th>
          <th class="text-center">Description</th>
          <th class="text-center">Date</th>
          <th class="text-right"></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(transaction, index) in transactions" :key="index"
            :class="{'text-warning': transaction.amount < 0}">
          <td class="">
            {{index + 1}}
          </td>
          <td class="">
            <h6>
              {{transaction.payable.full_name}}
            </h6>
            <p class="py-0 mb-0">
              <span class="badge badge-info">
                {{transaction.payable.stage.name}}
              </span>
              {{transaction.payable.user.username}}
            </p>
          </td>
          <td class="text-center font-weight-bold">
<!--            {{transaction.id}} <br>-->
            {{transaction.amount | number}}
          </td>
          <td class="text-center">
            {{transaction.meta != null ? transaction.meta['payment-type'] : ''}}
          </td>
          <td class="text-center">
            {{transaction.meta != null ? transaction.meta.comment : transaction.uuid}}
          </td>
          <td class="text-center">
            {{transaction.created_at | date}}
          </td>
          <td class="text-right font-weight-semibold">
              <span class="badge"
                    :class="{'badge-success': transaction.amount > 0,
                    'badge-warning': transaction.amount < 0}">
                {{transaction.amount > 0 ? 'Credit' : 'Debit'}}
              </span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "TransactionsDataList",
  props: {
    transactions: {
      required: true,
      type: Array
    },
    description: {
      default: 'Track / View list of transactions and bonuses issued from this order',
      required: false,
      type: String
    }
  }
}
</script>

<style scoped>

</style>
