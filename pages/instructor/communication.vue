<template>
  <div>
    <v-navigation-drawer
      class="accent-4 fixed"
      width="200"
      absolute
      :permanent="$vuetify.breakpoint.mdAndUp"
    >
      <v-list dense>
        <v-list-item v-for="item in items" :key="item.title" :to="item.to" link>
          <v-list-item-content>
            <v-list-item-title>
              <v-badge
                :color="unreadMessages ? 'red' : ''"
                :content="unreadMessages"
                :bottom="true"
                :inline="true"
                v-if="item.to == 'messages'"
              >
                {{ item.to === 'messages' ? item.title : '' }}
              </v-badge>
              {{ item.to !== 'messages' ? item.title : '' }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-content class="p-0">
      <v-container v-if="$vuetify.breakpoint.mdAndUp" class="ml-200">
        <nuxt-child />
      </v-container>
      <v-container v-if="$vuetify.breakpoint.smAndDown">
        <nuxt-child />
      </v-container>
    </v-content>
  </div>
</template>

<script>
import NotificationsController from '~/api/general'
export default {
  middleware: ['instructor'],
  layout: 'instructorSidebar',
  data() {
    return {
      messages: [],
      items: [
        { title: 'Q&A', to: 'qa' },
        { title: 'Announcements', to: 'announcements' },
        { title: 'Messages', to: 'messages' }
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
.ml-200 {
  margin-left: 200px !important;
}
.fixed {
  position: fixed;
  margin-left: 50px;
  margin-top: 60px;
}
.p-0 {
  padding: 0 !important;
}
.v-badge__badge {
  margin-top: 0px !important;
  padding: 3px 4px !important;
  height: 14px !important;
  min-width: 14px !important;
  border-radius: 7px !important;
  font-size: 9px;
}
.v-badge--dot .v-badge__badge {
  border-radius: 4.5px;
  height: 9px;
  min-width: 0;
  padding: 0;
  width: 9px;
}
</style>
