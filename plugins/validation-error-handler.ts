import Vue from "vue";
import ValidationErrorAlert from "@/components/ValidationErrorAlert.vue";

const _ = require('lodash');

if (!Vue.prototype.__validation_error_handler__) {
  Vue.prototype.__validation_error_handler__ = true

  let notification: any;

  Vue.mixin({
    data(){
      return {
        hasValidationError: false,
      }
    },
    methods: {
      closeValidationErrorNotification(){
        if (notification) {
          notification.close();
          notification = null;
          Vue.prototype.__validation__ = undefined;
        }
      },
      handleValidationError(hasError){

        const $this:any = this;

        $this.closeValidationErrorNotification();

        if (hasError){
          Vue.prototype.__validation__ = Object.assign({}, $this.$v);

          notification = Vue.prototype.$vs.notification({
            content: ValidationErrorAlert,
            position: 'top-right',
            notPadding: true,
            duration: 'none',
            buttonClose: false,
            clickClose: true,
          })
        }
      },
    },
    watch: {
      '$v': {
        deep: true,
        handler: _.debounce(function ($v: any, __:any) {
          // @ts-ignore
          const $this:any = this;

          const hasError = $v.$anyError;
          $this.handleValidationError(hasError);
        }, 300)
      }
    }
  }) // Set up your mixin then
}
