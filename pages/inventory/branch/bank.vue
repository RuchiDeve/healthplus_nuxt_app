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
        <div class="col-4">
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-body">
                  <vs-select block v-if="assignedBranches.length"
                             placeholder="Select an assigned branch..."
                             v-model="productBankList.branch_id">
                    <vs-option
                      label="Select an assigned branch..."
                      :value="-1">
                      Select an assigned branch...
                    </vs-option>
                    <vs-option
                      :key="index"
                      :label="branch.name"
                      v-for="(branch, index) in assignedBranches"
                      :value="branch.id">
                      {{ branch.name }}
                    </vs-option>
                  </vs-select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-8">
          <div class="pt-0 table-responsive" v-if="productBankList.data.length">
            <table class="table table-hover table-condensed" style="table-layout: initial">
              <thead class="thead-light">
              <tr>
                <th>Product</th>
                <th>Qty (bottles)</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(bank, index) in productBankList.data" :key="index">
                <td>{{bank.product.name}}</td>
                <td>{{bank.bottles | number}}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>


    </div>
  </div>

</template>

<script>
import {Permissions} from "~/utils/permissions";
import _ from "lodash";

export default {
  name: "new",
  layout: "app",
  data(){
    return {
      assignedBranches: [],
      products: [],
      productBankList: {
        data: [],
        branch_id: -1,
      },
    }
  },
  methods: {
    async fetchProductBank(branch_id){
      this.productBankList.data = await this.$axios.$get('/inventory/branch/' + branch_id + '/bank');
    },
    async fetchAssignedBranchForAuthUser(){
      this.assignedBranches = await this.$axios.$get('/branches/get-assigned-branch');
    },
  },
  computed: {
    searchData(){
      return this.search;
    },
    permissions(){
      return Permissions;
    },
    shouldResetSearchDialog(){
      var reset = false;

      for (const [key, value] of Object.entries(this.searchData)) {
        reset = !((value == null) || (value === ''));

        if(reset) break;
      }

      return reset;
    },
    selectedBranch(){
      if (this.productBankList.branch_id === -1) return null;
      return this.assignedBranches.find((branch) => branch.id === this.productBankList.branch_id);
    }
  },
  mounted() {
    this.fetchAssignedBranchForAuthUser();
  },
  watch: {
    'productBankList.branch_id': function(branch_id, __){
      if(branch_id){
        this.fetchProductBank(branch_id);
      }
    }
  }
}
</script>

<style scoped>

</style>
