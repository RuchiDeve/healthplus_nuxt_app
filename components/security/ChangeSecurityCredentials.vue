<template>

  <div class="card" ref="component">
    <div class="card-body">
      <div class="row">
        <div class="col-12">
          <div class="form-group pt-3 mb-4">
            <verified-username-input v-model="payload.username"
              :disabled="(($root.authMember && $root.authMember.is_active) || (!$root.authMember && !user))"
            ></verified-username-input>
          </div>
          <div class="form-group pt-4">
            <verified-email-input v-model="payload.email" :disabled="(($root.authMember && $root.authMember.is_active) || (!$root.authMember && !user))"></verified-email-input>
          </div>
          <div class="">
            <vs-button @click="save" flat :active-disabled="payload.email.length === 0">
              Save Credentials
            </vs-button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import VerifiedUsernameInput from "~/components/VerifiedUsernameInput";
import VerifiedEmailInput from "~/components/VerifiedEmailInput";
export default {
  name: "ChangeSecurityCredentials",
  components: {VerifiedEmailInput, VerifiedUsernameInput},
  data: () => ({
    payload: {
      email: '',
      username: ''
    }
  }),
  props: {
    user: {
      required: false,
      type: Object
    }
  },
  methods: {
    async save(){
      if (this.payload.email.length === 0){
        alert('Email is required');
        return;
      }
      await this.$doTask(async () => {
        let payload = {
          username: this.payload.username,
          email: this.payload.email,
        };
        payload.id = this.thisUser.id;
        try{
          await this.$axios.post('settings/update/account', payload);
          window.location.href = '/members/' + this.payload.username + '/details';
        } catch (e) {
          console.log('e', e);
        }
        finally {
          // todo: use refresh tokens

        }
      }, 'Saving credentials', this.$refs.component)
    }
  },
  computed: {
    thisUser(){
      return this.user || this.authUser;
    }
  },
  created() {
    this.payload.email = this.thisUser.email;
    this.payload.username = this.thisUser.username;
  }
}

/*


 */
</script>

<style scoped>

</style>

