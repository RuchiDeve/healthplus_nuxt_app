import {Context} from "@nuxt/types";
const _ = require('lodash');

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


const today = new Date();

let appContext: Context;

const Helpers = {
  setAppContext(context: Context){
    appContext = context;
  },
  getAppContent():Context {
    return appContext;
  },
  getCurrentMonth(){
    return monthNames[today.getMonth()];
  },
  getAuthUser(){
    return appContext.store.state.auth.user;
  },
  getUserAuthorizations(){
    const roles = this.getAuthUser().roles;
    const permissions = this.getAuthUser().permissions;

    return   _.concat(roles, permissions || []);
  },
  hasAuthorization(authority: string){
    return this.getUserAuthorizations().includes(authority);
  },
  hasAllAuthorizations(permissions: any){
    let hasAll: boolean = false;
    const authorizations = this.getUserAuthorizations();

    for (const index in permissions) {
      const p = permissions[index];
      hasAll = authorizations.includes(p);
      console.log('permission check', p, index, hasAll);
      if (!hasAll) break;
    }

    return hasAll;
  },
  hasAnyAuthorizations(permissions: any){
    let hasAny: boolean = false;
    const authorizations = this.getUserAuthorizations();

    for (const p in permissions) {
      hasAny = authorizations.includes(p);
      if (hasAny) break;
    }

    return hasAny;
  },
  hasDeveloperRole(){
    // return true;
    return this.hasAuthorization('all');
  },
  checkAuthority(...permissions:any){
    let isAuthorized: boolean = false;

    if (this.hasDeveloperRole()){
      isAuthorized = true;
    } else {

      if (typeof permissions === "string"){
        isAuthorized = this.hasAuthorization(permissions);
      } else if (Array.isArray(permissions)){
        isAuthorized = this.hasAllAuthorizations(permissions)
      }
    }

    return isAuthorized;
  },
  authorize(permissions:any){

    const isAuthorized = this.checkAuthority(permissions);

    if (!isAuthorized){
      appContext.redirect('/denied');
    }
  }
}

export default Helpers;
