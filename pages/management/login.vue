<template>
  <client-only>
    <v-content>
      <v-container>
        <v-row class="text-center mb-10" justify="center">
          <v-alert
            v-if="showError"
            dismissible
            color="red"
            border="left"
            elevation="2"
            colored-border
            icon="mdi-information"
          >
            You need to verify your email first. Kindly check your mailbox for
            the verification email
          </v-alert>
        </v-row>
        <v-row class="text-center mb-10" justify="center">
          <v-alert
            v-if="showPending"
            dismissible
            color="red"
            border="left"
            elevation="2"
            colored-border
            icon="mdi-information"
          >
            Your account is pending approval. You will be able to access your
            dashboard once approved
          </v-alert>
        </v-row>
        <div class="row align-center justify-center">
          <div class="col-12 col-sm-8 col-md-4">
            <v-card class="py-5" max-width="450" elevation="5">
              <v-row>
                <v-col>
                  <div
                    :class="
                      `font-weight-light text-center text ${
                        $vuetify.breakpoint.smAndDown ? 'headline' : 'title'
                      }`
                    "
                  >
                    Login
                    <p class="font-regular text--secondary mt-2 subtitle-1">
                      Management Area
                    </p>
                  </div>
                </v-col>
              </v-row>
              <v-form @submit.prevent="login">
                <v-card-text>
                  <v-row class="d-flex justify-center">
                    <v-col lg="10" class="py-0" sm="12" md="12">
                      <!-- <v-label>Email or Username</v-label> -->
                      <v-text-field
                        outlined
                        :label="
                          require_email ? 'email or username' : 'username'
                        "
                        v-model="email_or_username"
                        required
                        dense
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row class="d-flex justify-center">
                    <v-col lg="10" class="py-0" sm="12" md="12">
                      <!-- <v-label>Password</v-label> -->
                      <v-text-field
                        required
                        outlined
                        dense
                        v-model="password"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show1 ? 'text' : 'password'"
                        @click:append="show1 = !show1"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row class="d-flex mt-10 justify-center">
                    <v-col lg="6" class="py-0 text-center" sm="12" md="12">
                      <v-btn
                        :raised="!processing"
                        :loading="processing"
                        type="submit"
                        large
                        :color="processing ? 'grey' : '#a10942'"
                        dark
                        block
                        >Login</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-form>
            </v-card>
          </div>
        </div>
      </v-container>
      <notifications group="foo" />
    </v-content>
  </client-only>
</template>
<script>
import api from '~/api'
import { setAuthToken, resetAuthToken } from '~/utils/auth'
import cookies from 'js-cookie'
export default {
  layout: 'auth',
  data() {
    return {
      formError: null,
      password: '',
      email_or_username: '',
      show1: false,
      processing: false,
      showError: false,
      showPending: false,
      require_email: true,
      message: ''
    }
  },
  methods: {
    async login() {
      let data = {
        password: this.password,
        email_or_username: this.email_or_username
      }
      this.processing = true

      try {
        let res = await api.auth.login(data)
        let user = res.data.data.user

        this.$store.commit('SET_USER', user)
        setAuthToken(res.data.data.token) +
          cookies.set('x-access-token', res.data.data.token, {
            expires: 7
          })
        this.processing = false
        this.$notify({
          group: 'foo',
          title: 'Authenticated!',
          text: 'Login successful. redirecting...',
          type: 'success'
        })
        user.admin ? this.$router.push({ name: 'management' }) : ''
      } catch (error) {
        this.processing = false
        if (error.response.status == 401) {
          this.$notify({
            group: 'foo',
            title: 'Unauthorized',
            text: 'Your credentials do not match',
            type: 'error'
          })
          return
        }
        if (error.response.status == 422) {
          this.$notify({
            group: 'foo',
            title: 'Required',
            text: 'Email and password fields are required',
            type: 'error'
          })
          return
        } else {
          this.$notify({
            group: 'foo',
            title: 'Failed',
            text: 'Something went wrong. try again',
            type: 'warning'
          })
          return
        }
      }
    }
  },
  created() {
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
