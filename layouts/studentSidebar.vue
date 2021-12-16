<template>
  <client-only>
    <v-app dark>
      <v-navigation-drawer
        expand-on-hover
        :permanent="$vuetify.breakpoint.mdAndUp"
        app
      >
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
                color="red"
                :content="unreadMessages"
                :top="true"
                :overlap="true"
                v-if="item.title == 'Messages' && unreadMessages"
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
          <v-list-item @click="logOut">
            <v-list-item-action>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-action>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-navigation-drawer expand-on-hover v-model="drawer" app>
        <v-card class="mx-auto" width="300">
          <v-list>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>

              <v-list-item-title>
                <nuxt-link class="unstyle" to="/">Home</nuxt-link>
              </v-list-item-title>
            </v-list-item>

            <v-list-group
              prepend-icon="mdi-message-text"
              value="true"
              v-model="active"
              no-action
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>Messages </v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item>
                <v-list-item-title>
                  <nuxt-link
                    class="unstyle"
                    :to="{ name: 'instructor-communication-messages' }"
                  >
                    Inbox</nuxt-link
                  >
                </v-list-item-title>
              </v-list-item>
            </v-list-group>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>

              <v-list-item-title>
                <nuxt-link class="unstyle" :to="{ name: 'student-profile' }">
                  Profile</nuxt-link
                >
              </v-list-item-title>
            </v-list-item>

            <v-list-item @click="logOut">
              <v-list-item-icon>
                <v-icon>mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-navigation-drawer>

      <v-app-bar :clipped-left="clipped" fixed app>
        <v-app-bar-nav-icon
          @click.stop="drawer = !drawer"
          v-if="$vuetify.breakpoint.smAndDown"
        />

        <v-spacer />
        <ThemeChanger />

        <v-menu transition="slide-y-transition" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-badge
                :color="unreadMessages ? 'red' : ''"
                :content="unreadMessages"
                :top="true"
                :overlap="true"
              >
                <v-icon>mdi-bell</v-icon>
              </v-badge>
            </v-btn>
          </template>

          <v-list flat subheader shaped rounded>
            <v-list-item>
              <v-list-item-title class="pointer" @click="toMessaages"
                >You have {{ unreadMessages }} unread
                {{ unreadMessages > 1 ? 'messages' : 'message' }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu transition="slide-y-transition" bottom>
          <template v-slot:activator="{ on }">
            <v-list-item-avatar v-on="on">
              <img :src="avatar ? avatar : '/user.png'" />
            </v-list-item-avatar>
          </template>
          <v-list dense>
            <v-list-item>
              <v-list-item-title>
                <nuxt-link class="unstyle" :to="{ name: 'student-profile' }">
                  Profile</nuxt-link
                >
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="logOut">
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>

      <v-content>
        <nuxt :messagesProp="unreadMessages" />
      </v-content>
      <notifications group="foo" />

      <v-footer :fixed="fixed" app>
        <span>&copy; {{ new Date().getFullYear() }}</span>
      </v-footer>
    </v-app>
  </client-only>
</template>

<script>
import NotificationsController from '~/api/general'
import ThemeChanger from '~/components/ThemeChanger'

export default {
  middleware: ['student'],
  components: {
    ThemeChanger
  },
  data() {
    return {
      active: false,
      active2: false,
      clipped: false,
      drawer: false,
      fixed: false,
      messages: [],
      avatar: this.$store.state.user.account.image_url,
      items: [
        // {
        //   icon: 'mdi-home',
        //   title: 'Home',
        //   to: '/'
        // },
        {
          icon: 'mdi-play-box-multiple',
          title: 'Courses',
          to: '/student'
        },
        {
          icon: 'mdi-message-text',
          title: 'Messages',
          to: '/student/messages'
        },
        {
          icon: 'mdi-account',
          title: 'Profile',
          to: '/student/profile'
        }
      ]
    }
  },
  methods: {
    toMessaages() {
      this.$router.push({ name: 'student-messages' })
    },
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
