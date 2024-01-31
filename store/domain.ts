import {Context} from "@nuxt/types";
import { GetterTree, ActionTree, MutationTree } from 'vuex';

export type RootState = ReturnType<typeof state>

export const state = () => ({
  slug: null,
  domain: null,
});

export const mutations: MutationTree<any> = {
  setDomainSlug: (state: any, slug: string) => {
    state.slug = slug;
  },
  setDomain: (state:any, domain: object) => {
    state.domain = domain;
  }
}

export const actions: ActionTree<RootState, RootState> = {
  async checkDomain(storeContext: any){

    let {commit, state} = storeContext;

    try{
      let domain = (await this.$axios.post('domain/check', {
        'domain_slug':state.slug
      })).data;

      // console.log('check domain response', domain)

      commit('setDomain', domain);

    } catch (error) {
      console.log('error checking domain', error.response);

      this.$router.push('/domain-not-found');

    }
  }
}
