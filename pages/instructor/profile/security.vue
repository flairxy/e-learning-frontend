<template>
  <div>
    <div class="mt-10" flat>
      <v-container>
        <v-form>
          <div class="body-2 mb-10">
            New password should be different from old password
          </div>
          <v-row>
            <v-col class="py-0" cols="12" lg="8">
              <v-text-field
                label="Old Password"
                v-model="old_password"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0" cols="12" lg="8">
              <v-text-field
                label="New Password"
                v-model="password"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0" cols="12" lg="8">
              <v-text-field
                label="Confirm Password"
                v-model="password_confirmation"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
      <v-card-actions class="card-actions-right">
        <v-btn
          @click.prevent="updatePassword()"
          v-if="!processing"
          large
          tile
          color="error"
          >Update</v-btn
        >
        <v-btn v-else color="blue darken-1" :loading="true" disabled
          ><v-icon dark>mdi-cloud-upload</v-icon></v-btn
        >
      </v-card-actions>
    </div>
    <!-- <notifications group="foo" /> -->
  </div>
</template>
<script>
import api from '~/api/index'
export default {
  data() {
    return {
      old_password: '',
      password: '',
      password_confirmation: '',
      processing: false
    }
  },
  methods: {
    updatePassword() {
      let data = {
        password_confirmation: this.password_confirmation,
        password: this.password,
        old_password: this.old_password
      }
      this.processing = true
      api.auth
        .password(data)
        .then(async res => {
          this.processing = false
          this.password_confirmation = ''
          this.password = ''
          this.old_password = ''
          this.$notify({
            group: 'foo',
            title: 'Success',
            text: 'Update successful',
            type: 'success'
          })
        })
        .catch(error => {
          this.processing = false
          if (error.response.status == 422) {
            let messages = Object.values(error.response.data.message)
            messages.forEach(message => {
              this.$notify({
                group: 'foo',
                title: 'Required',
                text: message[0],
                type: 'error'
              })
            })
          } else {
            this.$notify({
              group: 'foo',
              title: 'Failed',
              text: error.response.data.message,
              type: 'error'
            })
          }
        })
    }
  }
}
</script>
