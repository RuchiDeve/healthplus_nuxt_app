import {Context} from "@nuxt/types";
import Vue from "vue";

const $vs = Vue.prototype.$vs;

export default function ({$axios}: Context){

  const buildValidationErrorMessage: any = (errors: any) => {
    console.log('validation errors', errors);
    let message = "<br />";

    for (const errorsKey in errors) {
      message += `
      <p>
      <div>Field: <span class="font-weight-bold">${errorsKey}</span></div>
      <ul>
      `;

      const errorMessages = errors[errorsKey];

      errorMessages.forEach((validationMessage: string) => {
        message += `
        <li>${validationMessage}</li>
        `;
      });
      message += '</ul></p>';
    }

    return message;
  }

  // $axios.defaults.withCredentials = true;
  $axios.setHeader('Accept', 'application/json');
  $axios.setHeader('X-Requested-With', 'XMLHttpRequest');


  $axios.onError((error:any) => {

    const code = parseInt(error.response && error.response.status)
    const data = error.response.data;

    if (code === 422) {
      $vs.notification({
        title: data.message,
        text: buildValidationErrorMessage(data.errors),
        color: 'danger',
        position: 'top-center',
        width: '90%',
        duration: 'none'
      });
    } else {
      $vs.notification({
        title: 'Error',
        text: data.message || data.exception,
        color: 'warning',
        position: 'top-right',
        duration: 7000
      });
    }
  })
}
