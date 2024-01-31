import {ActionTree, MutationTree} from "vuex";

export const state = () => ({
  stages: [],
  currencies: [],
  permissionsList:[],
});


export const mutations: MutationTree<any> = {
  setStages(state, stages: Array<any>){
    state.stages = stages;
  },
  setCurrencies(state, data: Array<any>){
    state.currencies = data;
  },
  setPermissionsList(state, permissions: Array<any>){
    state.permissionsList = permissions;
  },
}

export const actions:ActionTree<any, any> = {
  async fetchStages(storeContext){
    let response:any = await this.$axios.get('/stages');

    storeContext.commit('setStages', response.data);
  },
  async fetchCurrencies(storeContext){
    let response:any = await this.$axios.get('/currencies');

    storeContext.commit('setCurrencies', response.data);
  },
  async fetchPermissionsList(storeContext){
    if (storeContext.state.permissionsList && storeContext.state.permissionsList.length){
      return storeContext.state.permissionsList;
    }

    let response:any = await this.$axios.get('/security/permissions');

    storeContext.commit('setPermissionsList', response.data);
  },
}
