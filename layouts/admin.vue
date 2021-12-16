<template>
  <div>
    <client-only>
      <v-app dark>
        <v-navigation-drawer expand-on-hover permanent app>
          <v-list>
            <v-list-item
              v-for="(item, i) in items"
              :key="i"
              :to="item.to"
              router
              exact
            >
              <v-list-item-action>
                <v-badge
                  :color="unreadMessages ? 'red' : ''"
                  :content="unreadMessages"
                  :top="true"
                  :overlap="true"
                  v-if="item.title == 'Communication'"
                >
                  <v-icon>
                    {{ item.icon }}
                  </v-icon>
                </v-badge>
                <v-icon v-else>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="item.title" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>

        <v-app-bar :clipped-left="clipped" fixed app>
          <v-app-bar-nav-icon
            @click.stop="drawer = !drawer"
            v-if="$vuetify.breakpoint.smAndDown"
          />

          <v-spacer />
          <v-btn
            class="mr-4"
            icon
            @click.stop="$vuetify.theme.dark = !$vuetify.theme.dark"
          >
            <v-icon>mdi-weather-night</v-icon>
          </v-btn>
          <v-btn icon @click.stop="rightDrawer = !rightDrawer">
            <v-badge
              :color="unreadMessages ? 'red' : ''"
              :content="unreadMessages"
              :top="true"
              :overlap="true"
            >
              <v-icon>mdi-bell</v-icon>
            </v-badge>
          </v-btn>
          <v-menu transition="slide-y-transition" bottom>
            <template v-slot:activator="{ on }">
              <v-list-item-avatar v-on="on">
                <img src="/user.png" />
              </v-list-item-avatar>
            </template>
            <v-list dense>
              <v-list-item>
                <v-list-item-title>Profile</v-list-item-title>
              </v-list-item>
              <v-list-item @click="logOut">
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-app-bar>

        <v-content>
          <nuxt />
        </v-content>
        <notifications group="foo" />

        <v-footer :fixed="fixed" app>
          <span>&copy; {{ new Date().getFullYear() }}</span>
        </v-footer>
      </v-app>
    </client-only>
  </div>
</template>

<script>
import NotificationsController from '~/api/general'
export default {
  middleware: ['admin'],
  data() {
    return {
      active: false,
      active2: false,
      clipped: false,
      drawer: false,
      fixed: false,
      messages: [],
      items: [
        // {
        //   icon: 'mdi-home',
        //   title: 'E-learn',
        //   to: '/'
        // },
        {
          icon: 'mdi-play-box-multiple',
          title: 'Dashboard',
          to: '/management'
        },
        {
          icon: 'mdi-account-multiple',
          title: 'Users',
          to: '/management/users/approved'
        },
        {
          icon: 'mdi-notebook-multiple',
          title: 'Courses',
          to: '/management/courses/approved'
        },
        {
          icon: 'mdi-message-text',
          title: 'Notifications',
          to: '/management/notifications'
        },
        {
          icon: 'mdi-cogs',
          title: 'Settings',
          to: '/management/settings/general'
        }
      ]
    }
  },
  methods: {
    getMessages() {
      let data = {
        id: this.$store.state.user.id
      }
      NotificationsController.notifications.index(data).then(res => {
        let messages = res.data.data
        this.messages = messages
        this.$store.commit('SET_MESSAGES', messages)
      })
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
    this.getMessages()
  },
  computed: {
    unreadMessages() {
      let unread = this.messages.filter(message => {
        return message.read_at == null
      })
      this.$store.commit('SET_TOTAL_UNREAD', unread.length)

      return unread.length
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
