<template>
  <div class="my-1">
    <button class="btn btn-xs btn-warning"

            @click="initChange">
      <i class="mdi mdi-check-circle"></i>
      Change Up-Line
    </button>

    <vs-dialog blur v-model="changeUplineModal.show" @close="()=>{changeUplineModal.show = false; changeUplineModal.username = '';}">
      <template #header>
        <h4 class="not-margin">
          Change Up-Line
        </h4>
      </template>

      <div class="con-form mt-3">

        <div class="form-group">
          <vs-input block label="Up-Line's Username" :loading="changeUplineModal.verifyingUsername"
                    v-model="changeUplineModal.username"></vs-input>
        </div>

        <member-info-card :this-member="changeUplineModal.member"></member-info-card>

      </div>

      <template #footer>
        <div class="footer-dialog">
          <vs-button @click="changeUpLine" :disabled="!changeUplineModal.member" block>
            Submit
          </vs-button>
        </div>
      </template>
    </vs-dialog>

  </div>
</template>

<script>
import MemberInfoCard from "~/components/MemberInfoCard";
export default {
  name: "change-upline-button",
  components: {MemberInfoCard},
  data(){
    return {
      changeUplineModal: {
        show: false,
        member: null,
        username: '',
        verifyingUsername: false,
        payload: {
          member_username: '',
          up_line_username: '',
        }
      }
    }
  },
  props: {
    thisMember: {
      required: true,
    }
  },
  methods: {
    initChange(){
      this.changeUplineModal.show = true;
      this.changeUplineModal.member = null;
    },
    async changeUpLine(){

      await this.$doTask(async () => {

        this.changeUplineModal.payload.up_line_username = this.changeUplineModal.member.user.username;
        this.changeUplineModal.payload.member_username = this.thisMember.user.username;

        let response = await this.$axios.post('members/update/change-upline', {
          ...this.changeUplineModal.payload
        });

      }, 'Updating up-line...');

      window.location.reload();

    },
    async checkMember(username) {
      if (username === "") return;

      this.changeUplineModal.verifyingUsername = true;
      this.changeUplineModal.member = null;


      let response = await this.$axios.get("/members/check/" + username);

      const data = response.data;

      // turn off checking indicator
     this.changeUplineModal.verifyingUsername = false;

      if(data.member === undefined){
        this.$vs.notification({
          text: 'Member not found',
          position: 'top-center',
          color: 'danger'
        })
        return ;
      }

      // assign data
      this.changeUplineModal.member = data.member;

    },
  },
  watch: {
    'changeUplineModal.username': _.debounce(function(username){
      this.checkMember(username);
    }, 500),
  },
  computed: {
    canChange(){
      if(!(this.$root.authMember && this.thisMember.in_active)){
        return false;
      }

      return true;
    }
  }
}
</script>

<style scoped>

</style>
