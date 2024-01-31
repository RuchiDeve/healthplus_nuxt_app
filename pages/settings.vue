<template>
  <div class="row">
    <div class="col-12">
      <div class="row my-4">
        <div class="col-sm-4">
          <h4 class="display-4">Account Security Settings</h4>
          <p>
            You can update your username and email anytime <br>
            you wish, to cater for your security needs
          </p>
        </div>
        <div class="col-sm-6 offset-2">
          <change-security-credentials></change-security-credentials>
        </div>
      </div>

      <hr>

      <div class="row my-4">
        <div class="col-sm-4">
          <h4 class="display-4">Change Password</h4>
          <p>
            Secure your account anytime by changing your password
          </p>
        </div>
        <div class="col-sm-6 offset-2">
          <change-password></change-password>
        </div>
      </div>

      <hr v-if="$root.authMember">

      <div class="row my-4" v-if="$root.authMember">
        <div class="col-sm-4">
          <h4 class="display-4">Wallet Settings</h4>
          <p>
            Update your wallet PIN and set auto-withdrawal limit
          </p>
        </div>
        <div class="col-sm-6 offset-2">
          <wallet-pin-and-auto-withdrawal></wallet-pin-and-auto-withdrawal>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import ChangeSecurityCredentials from "~/components/security/ChangeSecurityCredentials";
import ChangePassword from "@/components/security/ChangePassword";
import WalletPinAndAutoWithdrawal from "@/components/security/WalletPinAndAutoWithdrawal";
export default {
  name: "settings",
  components: {WalletPinAndAutoWithdrawal, ChangePassword, ChangeSecurityCredentials},
  layout: "app",
  methods: {

  }
}
</script>

<style scoped>

</style>
