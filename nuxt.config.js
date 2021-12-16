import colors from 'vuetify/es5/util/colors'

export default {
  ssr: false,
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],

    script: [
      {
        src: 'https://code.jquery.com/jquery-3.5.0.min.js',
        type: 'text/javascript'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#9f0841',
    height: '5px'
  },
  loadingIndicator: {
    name: 'chasing-dots',
    color: '#9f0841',
    background: 'white'
  },
  /*
   ** Global CSS
   */
  css: [
    'quill/dist/quill.snow.css',
    'quill/dist/quill.bubble.css',
    'quill/dist/quill.core.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~plugins/vue-video.js', ssr: false },
    { src: '~plugins/vform.js', ssr: false },
    { src: '~plugins/vue-sweetalert2.js', ssr: false },
    { src: '~plugins/vue2-editor.js', ssr: false },
    { src: '~plugins/vue-quill-editor.js', ssr: false },
    { src: '~/plugins/vue-notification', ssr: false },
    { src: '~/plugins/paystack.client', ssr: false },
    { src: '~/plugins/star-rating', ssr: false },
    { src: '~/plugins/vue-swal', ssr: false },
    { src: '~/api/init.js' }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxtjs/vuetify'
    //  '@nuxtjs/router',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  router: {
    middleware: 'refreshToken'
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
