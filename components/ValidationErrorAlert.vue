<template>
  <vs-alert shadow danger>
    <template #title>
      Validation Error
    </template>
    <div v-for="message in validationMessages" v-html="message"></div>
  </vs-alert>
</template>

<script>
import Vue from "vue";
const validators = require('vuelidate/lib/validators');
import _ from 'lodash';

export default {
  name: "ValidationErrorAlert",
  data(){
    return {
      validation: null,
      errorFields: [],
      validatedErrorFields: [],
      validationFunctions: [],
      validationMessages: []
    }
  },
  methods:{
    renderValidationError(){
      this.initErrorFields();
      this.initValidatedErrorFields();

      this.validatedErrorFields.forEach((field) => {
        const fieldValidation = field.parent[field.prop];

        if (fieldValidation.$error){
          this.renderFieldValidationError(field.prop, fieldValidation);
        }
      })
    },
    initErrorFields(fields){
      const parentValidationFieldObject = fields || this.validation;
      const validationProps = _.keys(parentValidationFieldObject);

      validationProps.forEach((prop) => {
        if (prop.startsWith('$')) return ;
        if (prop.includes('.')) return;

        const exists = _.findIndex(this.errorFields, {prop: prop}) >= 0;

        if (exists) return;

        const fieldValidationObject = parentValidationFieldObject[prop];

        const fieldValidations = _.intersection(this.validationFunctions, _.keys(fieldValidationObject));

        if (fieldValidations.length){
          this.errorFields.push({parent: parentValidationFieldObject, prop: prop});
        } else {

          if (fieldValidationObject && fieldValidationObject.$params){
            this.initErrorFields(fieldValidationObject)
          }
        }

      })
    },
    initValidatedErrorFields(){
      this.errorFields.forEach((field) => {
        const fieldValidations = _.intersection(this.validationFunctions, _.keys(field.parent[field.prop]));
        if (fieldValidations.length > 0){
          this.validatedErrorFields.push(field);
        }
      })
    },
    renderFieldValidationError(fieldName, validatedField){
      const fieldValidations = _.intersection(this.validationFunctions, _.keys(validatedField));


      let message = '<div class="font-weight-bold">' +
        '<i class="mdi mdi-arrow-right-bold"></i>' +
        _.startCase(fieldName) +
        '</div><ul class="ml-3">';

      fieldValidations.forEach((validation) => {
        message += '<li>' +
          this.getErrorMessage(fieldName, validation) +
          '</li>';
      });

      message += '</ul>';

      this.validationMessages.push(message);
    },
    getErrorMessage(field, validation){
      field = _.startCase(field);

      switch (validation){
        case 'required':
          return `${field} is a required field`;
          case 'minLength':
            return `Minimum length for ${field} not provided.`
        default:
          return 'Error: ' + validation;
      }
    }
  },
  beforeMount() {
    this.validation = Vue.prototype.__validation__;
    this.validationFunctions = _.keys(validators);
    this.renderValidationError();

  }
}
</script>

<style scoped>

</style>
