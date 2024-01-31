<template>
  <div>
    <button class="btn btn-primary" @click="textMessageDialog.show = true">
      <i class="bx bxs-plus-circle"></i>
      New Text Message
    </button>
    <vs-dialog blur v-model="textMessageDialog.show"
               @close="textMessageDialog.show = false">
      <template #header>
        <h4 class="not-margin">
          New <b>Text Message</b>
        </h4>
      </template>

      <div class="con-form mt-3">
        <div class="mb-5">
          <vs-input block label="Recipients"
                    v-model="textMessageDialog.payload.recipients"></vs-input>
        </div>

        <div class="mb-5">
          <textarea v-model="textMessageDialog.payload.message"
                    class="form-control"
                    placeholder="Message:"
                    rows="10">
          </textarea>

        </div>

      </div>

      <template #footer>
        <div class="footer-dialog">
          <vs-button @click="sendText" block>
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
  name: "NewTextMessage",
  components: {PaymentChannelSelectorInput, MemberInfoCard},
  data: () => ({
    textMessageDialog: {
      show: false,
      payload: {
        message: '',
        all_members: false,
        recipients: '',
      }
    }
  }),
  props: {
    username: {
      require: false,
    }
  },
  methods: {
    async sendText(){
      await this.$doTask(async () => {
        let response = await this.$axios.post('sms', this.textMessageDialog.payload);
        console.log('send text message', response.data);
      }, "Loading...");
      this.textMessageDialog.show = false;
      window.location.reload();
    },
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>
