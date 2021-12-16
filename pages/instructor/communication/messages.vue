<template>
  <div>
    <v-container>
      <v-row dense>
        <v-col cols="12">
          <v-card color="#385F73" dark>
            <v-card-title class="headline">Messages</v-card-title>

            <v-card-subtitle
              >You have {{ $store.state.unreadMessages }} unread
              messages</v-card-subtitle
            >
          </v-card>
        </v-col>
      </v-row>
      <v-row class="mt-10">
        <v-col cols="8">
          <v-card
            outlined
            shaped
            class="py-0 pointer"
            @click.prevent="readMessage(message)"
            v-for="message in $store.state.messages"
            :key="message.id"
          >
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="subtitle">
                  {{ message.sender }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ message.body.substring(0, 20) + '...' }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="350">
        <v-card>
          <v-card-title class="headline"></v-card-title>

          <v-card-text class="subtitle-1">
            {{ currentMessage.body }}
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="primary darken-1" text @click="dialog = false">
              close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>
<script>
import NotificationsController from '~/api/general'
export default {
  layout: 'instructorSidebar',
  data() {
    return {
      currentMessage: {},
      dialog: false
    }
  },
  methods: {
    readMessage(message) {
      this.currentMessage = message
      this.dialog = !this.dialog
      let data = {
        id: message.id,
        user: this.$store.state.user.id
      }
      NotificationsController.notifications.update(data)
    }
  }
}
</script>
