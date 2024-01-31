<template>
  <vs-input v-model="email"
            :loading="verifying"
            :disabled="disabled"
            type="email" icon-after
            label="Your email:" block>
    <template #icon>
      <i class="ti-email"></i>
    </template>
    <template v-if="verified" #message-success>
      <i class="mdi mdi-check-circle"></i>
      Valid Email
    </template>
    <template v-if="!verified && email.length && (email !== value)" #message-danger>
      <i class="bx bxs-error"></i>
      Email already exists
    </template>
  </vs-input>
</template>

<script>
import _ from "lodash";

export default {
  name: "VerifiedEmailInput",
  data: () => ({
    email: '',
    verifying: false,
    verified: false,
    initValue: '',
  }),
  props: {
    value: {
      required: true,
    },
    disabled: {
      required: false,
      default: false,
    },
  },
  methods: {
    async checkEmail(email){
      if (email === "") return;
      this.verifying = true;
      let response = await this.$axios.get("/security/check/email/" + email, {
        params : {
          activeOnly: true
        }
      });

      this.verified = !response.data.exists;
      this.verifying = false;

      if (this.verified){
        this.$emit('input', this.email);
      } else {
        this.$emit('input', this.initValue);
      }
    },
  },
  created() {
    this.email = this.initValue = this.value;
  },
  watch: {
    'email': _.debounce(function(email){
      this.verified = false;
      this.checkEmail(email);
    },1000),
  }
}
</script>

<style scoped>

</style>
