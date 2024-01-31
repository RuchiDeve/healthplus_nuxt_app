import {Context} from "@nuxt/types";


export default async function(context: Context){
  let {req, store, $axios} = context;

  let domain: string;

  if (process.server){
    let host = req.headers.host;

    domain = host?.split('.')[0] ?? '';

    store.commit('domain/setDomainSlug', domain);

    await store.dispatch('domain/checkDomain', context);

  } else {
    domain = store.state.domain.slug;

  }

  $axios.setHeader('domainName', domain);

}
