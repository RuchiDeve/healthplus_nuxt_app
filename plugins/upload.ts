import {Context} from "@nuxt/types";
import {Inject} from "@nuxt/types/app";


const readFileInput = (event: InputEvent, onLoaded: Function) => {
  let input:any = event.target;

  if (input.files && input.files[0]) {
    let reader = new FileReader();

    reader.onload = function (e) {
      onLoaded(e.target?.result, input.files[0]);
    };

    reader.readAsDataURL(input.files[0]);

  }
}

const payloadToFormData = (payload: any) => {
  let formData = new FormData();

  for (let property in payload) {
    if (payload.hasOwnProperty(property)) {
      if (payload[property] === null) continue;

      if(payload[property] === true){
        formData.append(property, '1');
      } else if(payload[property] === false){
        formData.append(property, '0');
      } else {
        formData.append(property, payload[property]);
      }
    }
  }

  return formData;
}


export default ({}: Context, inject: Inject) => {
  inject("readFileInput", readFileInput);
  inject("payloadToFormData", payloadToFormData);
}
