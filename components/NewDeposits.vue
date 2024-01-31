<template>
  <div>
    <button class="btn btn-primary" @click="depositDialog.show = true">
      <i class="bx bxs-plus-circle"></i>
      New Deposit
    </button>
    <vs-dialog blur v-model="depositDialog.show"
               @close="depositDialog.show = false">
      <template #header>
        <h4 class="not-margin">
          New <b>Deposits</b>
        </h4>
      </template>

      <div class="con-form mt-3">
        <div class="mb-5">
          <div class="form-group">
            <vs-input block label="Username" :loading="depositDialog.checkingDepositorUsername"
                      :disabled="username"
                      v-model="depositDialog.payload.depositorUsername"></vs-input>
          </div>
          <member-info-card :this-member="depositDialog.depositorMember"></member-info-card>
        </div>

        <div class="mb-5">
          <vs-input block label="Amount"
                    v-model="depositDialog.payload.amount"></vs-input>
        </div>

        <div class="mb-5">
          <vs-input block label="Date of Deposit" type="date"
                    v-model="depositDialog.payload.depositedOn"></vs-input>
        </div>

        <div class="mb-5">
          <vs-input block label="Reference Number"
                    v-model="depositDialog.payload.referenceNumber"></vs-input>
        </div>

        <div class="mb-5">
          <payment-channel-selector-input v-model="depositDialog.payload.paymentChannel"></payment-channel-selector-input>
        </div>
      </div>

      <template #footer>
        <div class="footer-dialog">
          <vs-button @click="makeDeposit" block>
            Submit
          </vs-button>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>

<script>
import _ from "lodash";
import MemberInfoCard from "@/components/MemberInfoCard";
import PaymentChannelSelectorInput from "@/components/inputs/PaymentChannelSelectorInput";

export default {
  name: "NewDeposits",
  components: {PaymentChannelSelectorInput, MemberInfoCard},
  data: () => ({
    depositDialog: {
      show: false,
      depositorMember: null,
      checkingDepositorUsername: false,
      payload: {
        depositorUsername: '',
        amount: 0,
        referenceNumber: '',
        paymentChannel: '',
        depositedOn: ''
      }
    }
  }),
  props: {
    username: {
      require: false,
    }
  },
  methods: {
    async checkMember(username) {
      this.depositDialog.depositorMember = null;
      this.depositDialog.checkingDepositorUsername = true;

      let response = await this.$axios.get("/members/check/" + username, {
        params: {
          withSuggestions: false
        }
      });

      const data = response.data;
      this.depositDialog.checkingDepositorUsername = false;

      if(data.member === undefined){
        this.$vs.notification({
          text: 'No member identified for deposit',
          position: 'top-center',
          color: 'danger'
        })
        return ;
      }

      this.depositDialog.depositorMember = data.member;
    },
    async makeDeposit(){
      await this.$doTask(async () => {
        let response = await this.$axios.post('deposits/new', this.depositDialog.payload);
        console.log('make deposit', response.data);
      }, "Loading...");
      this.depositDialog.show = false;
      window.location.reload();
    },
  },
  watch: {
    'depositDialog.payload.depositorUsername': _.debounce(function(username){
      this.depositDialog.checkingDepositorUsername = false;
      this.checkMember(username);
    },1000),
  },
  mounted() {
    if (this.username){
      this.depositDialog.payload.depositorUsername = this.username;
      this.checkMember(this.username);
    }
  }
}
</script>

<style scoped>

</style>
