<template>
  <div>
    <v-card class="mt-10" flat>
      <v-form>
        <v-container>
          <v-row v-if="require_email">
            <v-col class="py-0" cols="12" lg="8">
              <v-text-field
                label="Email"
                :value="email"
                disabled
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0" cols="12" lg="8">
              <v-text-field
                label="Username"
                :value="username"
                disabled
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0" cols="12" lg="8">
              <v-text-field
                label="First Name"
                v-model="first_name"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0" cols="12" lg="8">
              <v-text-field
                label="Last Name"
                v-model="last_name"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="py-0" cols="12" lg="8">
              <v-text-field
                label="Phone"
                v-model="phone"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0" cols="12" lg="8">
              <v-text-field
                label="Headline"
                v-model="headline"
                :counter="counter"
                :maxlength="counter"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0" cols="12" lg="8">
              <v-label>Biography</v-label>
              <vue-editor v-model="biography"> </vue-editor>
              <span
                class="text--disabled"
                :class="$vuetify.breakpoint.mdAndDown ? 'subtitle-2' : ''"
              >
                Your biography should have at least 50 characters, links and
                coupon codes are not permitted.
              </span>
            </v-col>
            <br />
          </v-row>
        </v-container>
      </v-form>
      <v-card-actions class="card-actions-right">
        <v-btn @click.prevent="saveUser()" large tile color="error">Save</v-btn>
      </v-card-actions>
    </v-card>
    <!-- <notifications group="foo" /> -->
  </div>
</template>
<script>
import api from '~/api/index'
export default {
  data() {
    return {
      counter: 60,
      headline: '',
      biography: '',
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      phone: '',
      require_email: false
    }
  },
  methods: {
    saveUser() {
      let data = {
        id: this.$store.state.user.id,
        username: this.$store.state.user.username,
        first_name: this.first_name,
        last_name: this.last_name,
        biography: this.biography,
        headline: this.headline,
        phone: this.phone
      }
      api.auth
        .update(data)
        .then(async res => {
          try {
            let res = await api.auth.me()
            await this.$store.commit('SET_USER', res.data.data)
            this.$notify({
              group: 'foo',
              title: 'Success',
              text: 'Update successful',
              type: 'success'
            })
          } catch (error) {
            this.$notify({
              group: 'foo',
              title: 'Failed',
              text: 'Update unsuccessful',
              type: 'error'
            })
          }
        })
        .catch(error => {
          this.$notify({
            group: 'foo',
            title: 'Failed',
            text: 'Update unsuccessful',
            type: 'error'
          })
        })
    },
    getUser() {
      let user = this.$store.state.user
      this.first_name = user.first_name
      this.last_name = user.last_name
      this.biography = user.biography
      this.headline = user.headline
      this.email = user.email
      this.username = user.username
      this.phone = user.phone
      this.biography = user.account.biography
      this.headline = user.account.headline
    }
  },
  created() {
    this.getUser()
    let settings = this.$store.state.settings
    if (settings) {
      settings.forEach(setting => {
        if (setting.name == 'REQUIRE_EMAIL') {
          setting.value == 0
            ? (this.require_email = false)
            : (this.require_email = true)
        }
      })
    }
  }
}
</script>
