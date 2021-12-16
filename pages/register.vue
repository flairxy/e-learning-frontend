<template>
  <client-only>
    <v-content>
      <v-container>
        <v-row class="text-center" justify="center">
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
            Your registration was successful and is pending approval.
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
                    Register
                    <p class="font-regular text--secondary mt-2 subtitle-1">
                      Become a student
                    </p>
                  </div>
                </v-col>
              </v-row>
              <v-card-text>
                <v-row class="d-flex justify-center">
                  <v-col lg="10" class="py-0" sm="12" md="12">
                    <!-- <v-label>Email or Username</v-label> -->
                    <v-text-field
                      outlined
                      dense
                      label="Firstname"
                      v-model="firstname"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="d-flex justify-center">
                  <v-col lg="10" class="py-0" sm="12" md="12">
                    <!-- <v-label>Email or Username</v-label> -->
                    <v-text-field
                      dense
                      outlined
                      label="Lastname"
                      v-model="lastname"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="d-flex justify-center">
                  <v-col lg="10" class="py-0" sm="12" md="12">
                    <!-- <v-label>Email or Username</v-label> -->
                    <v-text-field
                      outlined
                      dense
                      label="Username"
                      v-model="username"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="d-flex justify-center">
                  <v-col lg="10" class="py-0" sm="12" md="12">
                    <!-- <v-label>Email or Username</v-label> -->
                    <v-text-field
                      outlined
                      dense
                      label="Phone"
                      v-model="phone"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="d-flex justify-center" v-if="require_email">
                  <v-col lg="10" class="py-0" sm="12" md="12">
                    <!-- <v-label>Email or Username</v-label> -->
                    <v-text-field
                      dense
                      outlined
                      label="Email"
                      v-model="email"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="d-flex justify-center">
                  <v-col lg="10" class="py-0" sm="12" md="12">
                    <!-- <v-label>Password</v-label> -->
                    <v-text-field
                      outlined
                      dense
                      label="Password"
                      v-model="password"
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show1 ? 'text' : 'password'"
                      @click:append="show1 = !show1"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="d-flex justify-center">
                  <v-col lg="10" class="py-0" sm="12" md="12">
                    <!-- <v-label>Password</v-label> -->
                    <v-text-field
                      outlined
                      dense
                      label="Confirm Password"
                      v-model="password_confirmation"
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show1 ? 'text' : 'password'"
                      @click:append="show1 = !show1"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="d-flex justify-center">
                  <v-col lg="10" class="py-0" sm="12" md="12">
                    <v-checkbox v-model="terms">
                      <template v-slot:label>
                        <div class="subtitle-2">
                          I agree with the
                          <a
                            @click.prevent="gotoTerms"
                            href="javascript::void(0)"
                            >terms and conditions</a
                          >
                        </div>
                      </template>
                    </v-checkbox>
                  </v-col>
                </v-row>
                <v-row class="d-flex justify-center">
                  <v-col lg="6" class="py-0 text-center" sm="12" md="12">
                    <v-btn
                      v-if="!processing"
                      raised
                      large
                      color="#a10942"
                      dark
                      block
                      @click.prevent="register"
                    >
                      Register</v-btn
                    >
                    <v-btn
                      v-else
                      class="ma-2"
                      :disabled="true"
                      block
                      color="#a10942"
                    >
                      <span>Processing...</span>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
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
  // layout: 'auth',
  data() {
    return {
      formError: null,
      password: '',
      password_confirmation: '',
      username: '',
      lastname: '',
      email: '',
      phone: '',
      terms: '',
      firstname: '',
      show1: false,
      processing: false,
      require_email: true,
      showError: false,
      showPending: false
    }
  },
  methods: {
    gotoTerms() {
      window.open('/terms')
    },
    async register() {
      this.processing = true
      let data = {
        username: this.username,
        last_name: this.lastname,
        first_name: this.firstname,
        terms: this.terms,
        phone: this.phone,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation
      }
      this.processing = true
      try {
        let res = await api.auth.register(data)
        let user = res.data.data.user

        if (this.require_email && user.email_verified == null) {
          this.processing = false
          this.$store.dispatch('RESET')
          this.showError = true
          this.resetForm()
        }

        if (user.status !== 2) {
          this.$notify({
            group: 'foo',
            title: 'Registered!',
            text: 'Registration successful.',
            type: 'success'
          })
          this.form = {}
          this.processing = false
          this.$store.dispatch('RESET')
          this.showPending = true
          this.resetForm()
        }

        if (!this.require_email && user.status == 2) {
          this.$store.commit('SET_USER', user)
          setAuthToken(res.data.data.token) +
            cookies.set('x-access-token', res.data.data.token, {
              expires: 7
            })
          this.resetForm()
          this.processing = false
          this.$notify({
            group: 'foo',
            title: 'Registered!',
            text: 'Registration successful. redirecting...',
            type: 'success'
          })
          user.tutor && !user.student
            ? this.$router.push({ name: 'instructor' })
            : user.student && !user.tutor
            ? this.$router.push({ name: 'student' })
            : user.tutor && user.student
            ? this.$router.push({ name: 'instructor' })
            : user.admin
            ? this.$router.push({ name: 'management' })
            : ''
        }
      } catch (error) {
        if (error.response.status == 422) {
          this.processing = false
          let messages = Object.values(error.response.data.message)
          messages.forEach(message => {
            this.$notify({
              group: 'foo',
              title: 'Required',
              text: message[0],
              type: 'info'
            })
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
    },
    resetForm() {
      this.username = ''
      this.last_name = ''
      this.first_name = ''
      this.terms = ''
      this.phone = ''
      this.email = ''
      this.password = ''
      this.password_confirmation = ''
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
  },
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()

      setTimeout(() => this.$nuxt.$loading.finish(), 500)
    })
  }
}
</script>
