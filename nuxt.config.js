
export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  ssr: false,
  // env: {
  //   baseUrl: process.env.BASE_URL,
  //   apiRoot: process.env.API_URL,
  // },
  head: {
    title: 'HealthPlus',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '/theme/vendors/font-awesome/css/font-awesome.min.css' },
      { rel: 'stylesheet', href: '/theme/vendors/mdi/css/materialdesignicons.min.css' },
      { rel: 'stylesheet', href: '/theme/vendors/puse-icons-feather/feather.css' },
      { rel: 'stylesheet', href: '/theme/vendors/css/vendor.bundle.base.css' },
      { rel: 'stylesheet', href: '/theme/css/style.css' },
      { rel: 'stylesheet', href: '/theme/vendors/x-editable/bootstrap-editable.css' },
      { rel: 'stylesheet', href: '/theme/vendors/themify-icons/themify-icons.css' },
    ],
    script: [
      {src: '/theme/vendors/js/vendor.bundle.base.js'},
      {src: '/theme/js/off-canvas.js'},
      {src: '/theme/js/hoverable-collapse.js'},
      {src: '/theme/js/misc.js'},
      {src: 'https://cdn.jsdelivr.net/npm/sweetalert2@9'},
      {src: 'https://cdn.jsdelivr.net/npm/lodash@4.17.20/lodash.min.js'},
      {src: '/theme/vendors/x-editable/bootstrap-editable.min.js'},
      // {src: '/theme/vendors/jquery-steps/jquery.steps.min.js'},
    ]
  },

  router: {
    middleware: [
      'domain',
      'auth',
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/init-context',
    '@/plugins/vuesax',
    '@/plugins/ActionProgressIndicator',
    '@/plugins/x-editable',
    '@/plugins/filters',
    '@/plugins/axios',
    '@/plugins/upload',
    '@/plugins/vuelidate',
    '@/plugins/vue-form-wizard',
    '@/plugins/validation-error-handler',
    '@/plugins/auth-data',
    '@/plugins/clipboard',
    '@/plugins/backend-files',
    '@/plugins/repositories',
    // {src: '@/plugins/sdk', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: {
    dirs: [
      '~/components',
      '~/components/chart-js',
      '~/components/inputs',
      '~/components/charts',
    ]
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/auth-next',
  ],

  publicRuntimeConfig: {
    axios: {
      baseURL: process.env.API_URL,
      credentials: true,
      progress: true,
    },
    baseUrl: process.env.BASE_URL,
    apiRoot: process.env.API_URL,
    backendHost: process.env.BACKEND_HOST,
  },

  auth: {
    cookie: {
      options: {
        maxAge: 100000
      }
    },
    strategies: {
      local: {
        token: {
          property: 'token',
          required: true,
          type: 'Bearer',
          maxAge: 36000
        },
        user: {
          property: 'user',
        },
        endpoints: {
          login: { url: '/auth/login', method: 'post' },
          logout: false,
          user: { url: '/user', method: 'get' },
        }
      }
    },
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // transpile:[
    //   // '@/plugins/backend_sdk/models/member',
    //   // '@tailflow/laravel-orion'
    // ],
  }
}
