import {ActionTree, MutationTree} from "vuex";

export const state = () => ({
  members: [],
  membersWithWallet: [],
  pageNumber: null,
  pagination: null,
  totalPages: null,
  memberDetails: null,
  search: {
    username: null,
    name: null,
    stage: null,
  }
});

export const mutations: MutationTree<any> = {
  setMembers(state, members){
    state.members = members;
  },
  setMembersWithWallet(state, members){
    state.membersWithWallet = members;
  },
  setPagination(state, pagination){
    state.pagination = pagination;
  },
  setTotalPages(state, totalPages){
    state.totalPages = totalPages;
  },
  setMemberDetails(state, data){
    state.memberDetails = data;
  },
  setSearchQueryData(state, data:object){
    state.search = data;
  },
  setPageNumbers(state, page:bigint){
    state.pageNumber = page;
  }
}

export const actions: ActionTree<any, any> = {
  async fetchMembers(storeContext){
    let response = await this.$axios.$get('members', {
      params : {
        page: storeContext.state.pageNumber,
        ...storeContext.state.search
      }
    });


    await storeContext.commit('setMembers', response.data);
    await storeContext.commit('setTotalPages', response.last_page);
  },
  async fetchMemberDetails(storeContext, username){
    let response:any;
    storeContext.commit('setMemberDetails', null);

    try {
      response = await this.$axios.get('members/' + username + '/details');

      // console.log('member', response.data);
    } catch (e){
      console.log('error fetching member details', e.response);
      return;
    }

    storeContext.commit('setMemberDetails', response.data);

  },
  async fetchMembersWithWallet(storeContext){
    let response = await this.$axios.$get('members/wallets', {
      params : {
        page: storeContext.state.pageNumber,
        ...storeContext.state.search
      }
    });

    await storeContext.commit('setMembersWithWallet', response.data);
  },
  async resetSearchQuery(storeContext){
    storeContext.commit('setSearchQueryData', {
      username: null,
      name: null,
      stage: null,
    });
    await storeContext.dispatch('fetchMembers');
  }
}
