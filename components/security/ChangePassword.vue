<template>
  <div class="card" ref="change-password-component">
    <div class="card-body">
      <div class="row">
        <div class="col-12">
          <div class="form-group pt-3 mb-4">
            <vs-input v-model="payload.currentPassword"
                      type="password" icon-after
                      label="Current Password:" block>
              <template #icon>
                <i class="ti-lock"></i>
              </template>
            </vs-input>
          </div>
          <div class="form-group pt-4">
            <vs-input v-model="payload.newPassword"
                      type="password" icon-after
                      label="New Password:" block>
              <template #icon>
                <i class="ti-lock"></i>
              </template>
            </vs-input>
          </div>
          <div class="">
            <vs-button @click="save" flat>
              Save
            </vs-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChangePassword",
  data: () => ({
    payload: {
      currentPassword: '',
      newPassword: ''
    }
  }),
  methods: {
    async save(){
      if (this.payload.currentPassword.length === 0){
        alert('Please enter your current password.');
        return;
      }
      await this.$doTask(async () => {
        const response = await this.$axios.post('security/update/password', this.payload);

        if (!response.data.success){
          this.$vs.notification({
            text: 'Incorrect data',
            position: 'top-center',
            color: 'danger'
          });
          return;
        }

        this.$vs.notification({
          text: 'Password changed',
          position: 'top-center',
          color: 'success'
        })

      }, 'Updating password', this.$refs["change-password-component"])
    }
  },
}
</script>

<style scoped>

</style>
