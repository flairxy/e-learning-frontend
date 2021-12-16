<template>
  <div>
    <client-only>
      <v-app dark>
        <v-navigation-drawer
          v-if="$vuetify.breakpoint.smAndDown"
          v-model="drawer"
          :clipped="clipped"
          fixed
          app
        >
          <v-list v-if="isLoggedIn">
            <v-list-item :to="homeInfo.to" router exact>
              <v-list-item-action>
                <v-icon>{{ homeInfo.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="homeInfo.title" />
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="dashboard">
              <v-list-item-action>
                <v-icon>mdi-book</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="'Dashboard'" />
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="logOut">
              <v-list-item-content>
                <v-btn dense class="pointer body-2 text-capitalize"
                  ><v-icon>mdi-power</v-icon> Logout</v-btn
                >
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-list v-if="!isLoggedIn">
            <v-list-item
              v-for="(item, i) in items"
              :key="i"
              :to="item.to"
              router
              exact
            >
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="item.title" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
        <v-app-bar flat fixed app>
          <v-app-bar-nav-icon
            v-if="$vuetify.breakpoint.smAndDown"
            @click.stop="drawer = !drawer"
          />
          <span @click="home" class="pointer">
            <img v-if="$vuetify.theme.dark" width="120" src="/logo.png" />
            <img v-else width="120" src="/invoge-logo.png" />
          </span>

          <!-- <v-menu>
            <template v-slot:activator="{ on, attrs }">
              <span
                v-bind="attrs"
                v-on="on"
                v-if="$vuetify.breakpoint.mdAndUp"
                class="body-2 font-weight-light"
              >
                Categories
              </span>
            </template>

            <v-list>
              <v-list-item
                @click="method"
                v-for="category in categories"
                :key="category.id"
              >
                <v-list-item-title> {{ category.name }} </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu> -->

          <v-spacer />
          <ThemeChanger />
          <div v-if="isLoggedIn && $vuetify.breakpoint.mdAndUp">
            <v-btn
              @click="dashboard"
              dense
              class="mr-2 pointer body-2 text-capitalize"
              >Dashboard</v-btn
            >
            <v-btn @click="logOut" dense class="pointer body-2 text-capitalize"
              >Logout</v-btn
            >
          </div>
          <div v-if="!isLoggedIn && $vuetify.breakpoint.mdAndUp">
            <div class="row">
              <span @click="instructor()" class="p-2 mr-5 pointer body-2">
                {{
                  $vuetify.breakpoint.mdAndUp
                    ? 'Become an instructor'
                    : 'Instructor'
                }}
              </span>
              <span @click="login" class="mr-5 pointer body-2">
                Login
              </span>
              <span @click="register" class="mr-5 pointer body-2">
                Register
              </span>
            </div>
          </div>
        </v-app-bar>

        <v-content>
          <nuxt />
        </v-content>
        <Footer />
      </v-app>
    </client-only>
  </div>
</template>

<script>
import api from '~/api/general'
import Footer from './footer'
import ThemeChanger from '~/components/ThemeChanger'
export default {
  components: {
    Footer,
    ThemeChanger
  },
  data() {
    return {
      active: false,
      active2: false,
      clipped: false,
      drawer: false,
      fixed: false,
      theme: null,
      search: '',
      categories: [],
      homeInfo: {
        icon: 'mdi-home',
        title: 'E-learn',
        to: '/'
      },
      items: [
        {
          icon: 'mdi-account-plus',
          title: 'Become an Instructor',
          to: '/instructor/register'
        },
        {
          icon: 'mdi-login',
          title: 'Login',
          to: '/login'
        },
        {
          icon: 'mdi-account-plus-outline',
          title: 'Register',
          to: '/register'
        }
      ]
    }
  },
  methods: {
    home() {
      this.$router.push('/')
    },
    instructor() {
      this.$router.push({ name: 'instructor-register' })
    },
    login() {
      this.$router.push({ name: 'login' })
    },
    register() {
      this.$router.push({ name: 'register' })
    },
    dashboard() {
      let user = this.$store.state.user
      user.tutor && !user.student
        ? this.$router.push({ name: 'instructor' })
        : user.student && !user.tutor
        ? this.$router.push({ name: 'student' })
        : user.tutor && user.student
        ? this.$router.push({ name: 'instructor' })
        : ''

      user.admin ? this.$router.push({ name: 'management' }) : ''
    },
    logOut() {
      this.$store.dispatch('RESET').then(() => {
        this.$router.push('/')
        this.$notify({
          group: 'foo',
          title: 'Logged out!!',
          text: 'Logout successful',
          type: 'success'
        })
      })
    }
  },
  created() {
    api.category.get().then(res => {
      this.categories = res.data.data
    })
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.user
    },
    viewLogin() {
      this.$router.push({ name: 'login' })
    },
    viewRegister() {
      this.$router.push({ name: 'register' })
    }
  }
}
</script>
<style>
.pointer {
  cursor: pointer;
}
.unstyle {
  color: rgb(63, 63, 63) !important;
  text-decoration: none;
}
</style>
