<template>

  <div class="d-flex flex-column justify-content-between align-items-start"
       ref="payment-channels" style="min-height: 150px;">
    <p class="text-small font-weight-bold pb-0 mb-0">Payment channels:</p>
    <vs-radio dark v-model="selectedChannel" :val="channel"
    v-for="(channel, index) in channels" :key="index">
      {{channel}}
    </vs-radio>
  </div>

</template>

<script>
export default {
  name: "PaymentChannelSelectorInput",
  data(){
    return {
      channels: [],
      selectedChannel: null,
      fetching: false,
    }
  },
  props: {
    value: {
      required: false,
    }
  },
  methods: {
    async getPaymentChannels(){
      await this.$doTask(async ()=> {
        this.fetching = true;
        let response = await this.$axios.get('payment-channels');
        this.channels = response.data;
      }, 'Loading payment channels', this.$refs["payment-channels"]);
      this.fetching = false;
    }
  },
  async mounted(){
    await this.getPaymentChannels();
  },
  watch: {
    selectedChannel(channel, __){
      this.$emit('input', channel);
    },
    value(_, __){
      if (!this.value) return;
      this.selectedChannel = this.value;
      console.log('value', this.value);
    }
  }
}
</script>

<style scoped>

</style>
