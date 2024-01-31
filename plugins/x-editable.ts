import {Context} from "@nuxt/types";
import {Inject} from "@nuxt/types/app";


export default (context: Context, inject: Inject) => {

  inject('initXEditable', (delay: number) => {
    if (delay === undefined) delay = 2000;

    setTimeout(() => {
      initXEditable(context);
    }, delay)
  })

}

const initXEditable = (context: Context) =>{

  const $window:any = window;

  $window.$.fn.editable.defaults.mode = 'inline';
  $window.$.fn.editableform.buttons =
    '<button type="submit" class="btn btn-primary btn-sm editable-submit">' +
    '<i class="fa fa-fw fa-check"></i>' +
    '</button>' +
    '<button type="button" class="btn btn-default btn-sm editable-cancel">' +
    '<i class="fa fa-fw fa-times"></i>' +
    '</button>';

  const $this:any = context;

  const bearerToken = $this.$auth.strategy.token.get();

  $window.$('.as-editable').editable({
    ajaxOptions: {
      headers: {
        'Authorization': bearerToken,
      },
      contentType: 'application/json',
      type: 'POST',
      dataType: 'json'
    },
    params: function(params: any) {
      params.id = params.pk;
      return JSON.stringify(params);
    },
    error: function(response: any, newValue: any) {
      console.log(response.responseText);
      return 'Error performing update.';
    }
  });
}
