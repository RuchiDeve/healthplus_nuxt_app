import { ActionTree } from 'vuex';

export const actions: ActionTree<any, any> = {
  async login(storeContext, payload: any){

    const $this:any = this;

    await $this.$auth.loginWith('local', {
      data: payload
    });

    console.log('auth user', this.$auth.user);

  },
  async logout(storeContext){
    const $this:any = this;

    await $this.$auth.logout();

    await this.$router.push('/login');

    window.location.href = '/';
  }
}


