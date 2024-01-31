<template>
  <div>
    <button class="btn btn-primary" @click="withdrawalDialog.show = true">
      <i class="bx bxs-plus-circle"></i>
      New Withdrawal
    </button>
    <vs-dialog blur v-model="withdrawalDialog.show"
               @close="withdrawalDialog.show = false">
      <template #header>
        <h4 class="not-margin">
          New <b>Withdrawal</b>
        </h4>
      </template>

      <div class="con-form mt-3">
        <div class="mb-5">
          <div class="form-group">
            <vs-input block label="Username" :loading="withdrawalDialog.checkingUsername"
                      :disabled="username"
                      v-model="withdrawalDialog.payload.memberUsername"></vs-input>
          </div>
          <member-info-card :this-member="withdrawalDialog.withdrawalMember"></member-info-card>
        </div>

        <div class="mb-5">
          <vs-input block label="Amount"
                    v-model="withdrawalDialog.payload.amount"></vs-input>
        </div>

        <div class="mb-5">
          <vs-input block label="Wallet PIN:" type="password"
                    v-model="withdrawalDialog.payload.pin"></vs-input>
        </div>

      </div>

      <template #footer>
        <div class="footer-dialog">
          <vs-button @click="makeWithdrawal" block>
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
export default {
  name: "NewWithdrawal",
  components: {MemberInfoCard},
  data: () => ({
    withdrawalDialog: {
      show: false,
      withdrawalMember: null,
      checkingUsername: false,
      payload: {
        memberUsername: '',
        amount: 0,
        pin: ''
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
      this.withdrawalDialog.withdrawalMember = null;
      this.withdrawalDialog.checkingUsername = true;

      let response = await this.$axios.get("/members/check/" + username, {
        params: {
          withSuggestions: false
        }
      });

      const data = response.data;
      this.withdrawalDialog.checkingUsername = false;

      if(data.member === undefined){
        this.$vs.notification({
          text: 'No member identified for deposit',
          position: 'top-center',
          color: 'danger'
        })
        return ;
      }

      this.withdrawalDialog.withdrawalMember = data.member;
    },
    async makeWithdrawal(){
      await this.$doTask(async () => {
        let response = await this.$axios.post('withdrawals/new', this.withdrawalDialog.payload);
        console.log('make withdrawal', response.data);
        console.log('make withdrawal', response.data);
      }, "Loading...");
      this.withdrawalDialog.show = false;
    },
  },
  watch: {
    'withdrawalDialog.payload.depositorUsername': _.debounce(function(username){
      this.withdrawalDialog.checkingUsername = false;
      this.checkMember(username);
    },1000),
  },
  mounted() {
    if (this.username){
      this.withdrawalDialog.payload.memberUsername = this.username;
      this.checkMember(this.username);
    }
  }
}
</script>

<style scoped>

</style>
