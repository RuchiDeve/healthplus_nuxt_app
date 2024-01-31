<template>

  <div class="row" ref="branches-list">
    <div class="col-12">
      <div class="row mb-3">
        <div class="col-12 d-flex justify-content-between">
          <h3 class="display-4">
            <i class="bx bxs-bank"></i>
            Product Bank
          </h3>

        </div>
      </div>

      <div class="row mb-3">

        <div class="col-12">
          <stockist-product-bank-list :stockist="$root.authMember"></stockist-product-bank-list>
        </div>

      </div>


    </div>
  </div>

</template>

<script>
import {Permissions} from "~/utils/permissions";
import _ from "lodash";
import StockistProductBankList from "~/components/stockist-product-bank-list";

export default {
  name: "new",
  components: {StockistProductBankList},
  layout: "app",
  data(){
    return {
    }
  },
  methods: {


  },
  watch: {

  }
}
</script>

<style scoped>

</style>
