<template>
  <vs-input v-model="username"
            :loading="verifying"
            :disabled="disabled" icon-after
            label="Your username:" block>
    <template #icon>
      <i class="ti-user"></i>
    </template>
    <template v-if="verified" #message-success>
      <i class="mdi mdi-check-circle"></i>
      Valid Username
    </template>
    <template v-if="!verified && username.length && (username !== value)" #message-danger>
      <i class="bx bxs-error"></i>
      Username already exists
    </template>
  </vs-input>
</template>

<script>
import _ from "lodash";

export default {
  name: "VerifiedUsernameInput",
  data: () => ({
    username: '',
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
    }
  },
  methods: {
    async checkUsername(username){
      if (username === "") return;
      this.verifying = true;
      let response = await this.$axios.get("/security/check/username/" + username, {
        params : {
          activeOnly: true
        }
      });

      this.verified = !response.data.exists;
      this.verifying = false;

      if (this.verified){
        this.$emit('input', this.username);
      } else {
        this.$emit('input', this.initValue);
      }
    },
  },
  mounted() {
    this.username = this.initValue = this.value;
  },
  watch: {
    'username': _.debounce(function(username){
      this.verified = false;
      this.checkUsername(username);
    },1000),
  }
}
</script>

<style scoped>

</style>
