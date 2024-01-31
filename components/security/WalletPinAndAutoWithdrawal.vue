<template>
  <div class="card" ref="wallet-settings">
    <div class="card-body">
      <div class="row">
        <div class="col-12">
          <div class="form-group pt-3 mb-4">
            <vs-input v-model="payload.pin"
                      type="text" icon-after
                      label="Wallet Pin:" block>
            </vs-input>
            <vs-button dark size="mini" @click="$copyText(payload.pin)">
              <i class="mdi mdi-content-copy"></i>
              copy
            </vs-button>
          </div>
          <div class="form-group pt-4">
            <vs-input v-model="payload.autoWithdraw"
                      type="text" icon-after
                      label="Auto-withdrawal amount:" block>
              <template #icon>
                <i class="ti-money"></i>
              </template>
            </vs-input>
          </div>
          <div class="">
            <vs-button @click="save" flat>
              Submit
            </vs-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WalletPinAndAutoWithdrawal",
  data: () => ({
    payload: {
      pin: '',
      autoWithdraw: ''
    }
  }),
  methods: {
    async save(){
      if (this.payload.pin.length === 0){
        alert('Please enter a wallet pin.');
        return;
      }
      await this.$doTask(async () => {
        const response = await this.$axios.post('settings/update/wallet', this.payload);

        if (!response.data.success){
          this.$vs.notification({
            text: 'Incorrect data',
            position: 'top-center',
            color: 'danger'
          });
          return;
        }

        this.$vs.notification({
          text: 'Wallet settings updated',
          position: 'top-center',
          color: 'success'
        });
        window.location.reload();

      }, 'Connecting...', this.$refs["wallet-settings"])
    }
  },
  mounted() {
    this.payload.pin = this.$root.authMember.wallet_pin;
    this.payload.autoWithdraw = this.$root.authMember.auto_withdraw_amount;
  }
}
</script>

<style scoped>

</style>
