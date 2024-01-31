
import Vue from "vue";
import Helpers from "~/utils/helpers";

if (!Vue.prototype.__auth_data_plugin__){
  Vue.prototype.__auth_data_plugin__ = true;

  Vue.directive('authorization', {
    bind(el, binding, vnode){
      const permissions = binding.value;
      const authorized = Helpers.checkAuthority(permissions);

      if (!authorized){
        el.style.display = 'none';
      }
    },
  });

  Vue.mixin({
    computed: {
      authUser(){
        const $this: any = this;

        return $this.$store.state.auth.user;
      },
      authMember(){
        const $this: any = this;

        if ($this.authUser && ($this.authUser.is_member)){
          return $this.authUser.person;
        }
        return null;
      },
      authBranchAdmin(){
        const $this: any = this;

        if ($this.authUser && ($this.authUser.is_branch_admin)){
          return $this.authUser.person;
        }
        return null;
      },
      authStaff(){
        const $this: any = this;

        if ($this.authUser && ($this.authUser.is_staff)){
          return $this.authUser.person;
        }
        return null;
      },
      authPartner(){
        const $this: any = this;

        if ($this.authUser && ($this.authUser.is_staff)){
          return $this.authUser.person;
        }
        return null;
      },
      authSupplier(){
        const $this: any = this;

        if ($this.authUser && ($this.authUser.is_supplier)){
          return $this.authUser.person;
        }
        return null;
      }
    }
  });
}

