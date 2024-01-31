import {Context} from "@nuxt/types";
import {Inject} from "@nuxt/types/app";
import Vue from "vue";

const $vs = Vue.prototype.$vs;

export default ({app}: Context, inject: Inject) => {

  inject('doTask', async (action: any, text:string, target: any) => {
    if (process.server){
      await action();
      return;
    }

    let loading: any;

    loading = $vs.loading({
      text: text,
      target: target
    });

    try {
      await action();
    } catch (e) {
      console.log('error', e.response.data);

      $vs.notification({
        text: e.response.data.message,
        position: 'top-center',
        color: 'danger'
      })
    } finally {
      loading?.close();
    }

  })
}


