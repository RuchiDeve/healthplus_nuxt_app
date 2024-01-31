<template>
  <div class="my-1">
    <button class="btn btn-xs btn-warning"
            :disabled="!canChange"
            @click="initChange">
      <i class="mdi mdi-check-circle"></i>
      Change Sponsor
    </button>

    <vs-dialog blur v-model="changeSponsorModal.show" @close="changeSponsorModal.show = false">
      <template #header>
        <h4 class="not-margin">
          Change Sponsor
        </h4>
      </template>

      <div class="con-form mt-3">

        <div class="form-group">
          <vs-input block label="Sponsor's Username" :loading="changeSponsorModal.verifyingUsername"
                    v-model="changeSponsorModal.username"></vs-input>
        </div>

        <member-info-card :this-member="changeSponsorModal.member"></member-info-card>

      </div>

      <template #footer>
        <div class="footer-dialog">
          <vs-button @click="changeSponsor" :disabled="!changeSponsorModal.member" block>
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
  name: "change-sponsor-button",
  components: {MemberInfoCard},
  data(){
    return {
      changeSponsorModal: {
        show: false,
        member: null,
        username: '',
        verifyingUsername: false,
        payload: {
          member_username: '',
          sponsor_username: '',
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
      this.changeSponsorModal.show = true;
      this.changeSponsorModal.member = null;
    },
    async changeSponsor(){

      await this.$doTask(async () => {

        this.changeSponsorModal.payload.sponsor_username = this.changeSponsorModal.member.user.username;
        this.changeSponsorModal.payload.member_username = this.thisMember.user.username;

        let response = await this.$axios.post('members/update/change-sponsor', {
          ...this.changeSponsorModal.payload
        });

      }, 'Updating sponsor...');

      window.location.reload();

    },
    async checkMember(username) {
      if (username === "") return;

      this.changeSponsorModal.verifyingUsername = true;
      this.changeSponsorModal.member = null;


      let response = await this.$axios.get("/members/check/" + username);

      const data = response.data;

      // turn off checking indicator
     this.changeSponsorModal.verifyingUsername = false;

      if(data.member === undefined){
        this.$vs.notification({
          text: 'Member not found',
          position: 'top-center',
          color: 'danger'
        })
        return ;
      }

      // assign data
      this.changeSponsorModal.member = data.member;

    },
  },
  watch: {
    'changeSponsorModal.username': _.debounce(function(username){
      this.checkMember(username);
    }, 500),
  },
  computed: {
    canChange(){
      if((!this.$root.authMember) || this.thisMember.is_inactive){
        return true;
      }

      return false;
    }
  }
}
</script>

<style scoped>

</style>
