import Vue from "vue";

Vue.filter('currency', (value: Number, symbol: string)=>{
  if (symbol === undefined) symbol = 'NGN';

  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
    style: 'currency',
    currency: symbol
  });
});

Vue.filter('money', (value: Number)=>{
  if (!value) return 0.00;
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  });
});

Vue.filter('number', (value: Number)=>{
  if (!value) return 0;
  return value.toLocaleString();
});

Vue.filter('date', (value: string)=>{
  if(value === null) {
    return 'N/A'
  }

  let date = new Date(value);

  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
  });
  // return date.toLocaleString();
});
