import makeQueryString from "./query-builder";
export default ($axios: { $get: (arg0: string) => Promise<any>; create: () => any; $post: (arg0: string, arg1: any) => Promise<any>; $put: (arg0: string, arg1: any) => Promise<any>; $delete: (arg0: string) => Promise<any>; }) => (resource: any) => ({
  index(queryParams: any) {
    let url = resource
    if (queryParams) {
      let query = makeQueryString(queryParams);

      url += `?${query}`;
    }
    return $axios.$get(`/${url}`);
  },
  show(id: any) {
    return $axios.$get(`${resource}/${id}`);
  },
  create(params: any, fileUpload = false) {
    if (fileUpload) {
      let axios = $axios.create();
      delete axios.defaults.headers.common["content-type"];
      delete axios.defaults.headers.post["content-type"];
      return axios({
        method: "POST",
        url: `${resource}`,
        data: params,
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
        },
      });
    }
    return $axios.$post(`${resource}`, params);
  },
  update(id: any, params: any) {
    return $axios.$put(`${resource}/${id}`, params);
  },
  delete(id: any) {
    return $axios.$delete(`${resource}/${id}`);
  },
});
