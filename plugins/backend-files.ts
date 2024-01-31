import {Context} from "@nuxt/types";
import {Inject} from "@nuxt/types/app";

const makeBackendFiles = (context :Context) => (file :string) => {
  return `${context.$config.backendHost}${file}`
}


export default (context: Context, inject: Inject) => {
  const backendFiles = makeBackendFiles(context)
  inject("backendFiles", backendFiles)
}
