<template>
  <client-only>
    <div class="container" :key="index">
      <v-row>
        <v-col cols="12">
          <v-card flat class="px-10">
            <v-card-title class="mb-10">
              <h3 class="text--disabled basil--text">
                General
              </h3>
            </v-card-title>
            <v-switch
              v-model="require_email"
              label="Require and verify email on registration"
              color="primary"
              value=""
              hide-details
            ></v-switch>
            <v-switch
              v-model="auto_approve_account"
              label="Manually approve accounts"
              color="primary"
              value=""
              hide-details
            ></v-switch>
            <v-switch
              v-model="tutor_price"
              label="Enable individual price by tutors"
              color="primary"
              value=""
              hide-details
            ></v-switch>
            <v-switch
              v-model="allow_review"
              label="Enable rating and review of courses"
              color="primary"
              value=""
              hide-details
            ></v-switch>
            <v-switch
              v-model="auto_approve_email_ext"
              label="Auto approve special email domain"
              color="primary"
              value=""
              hide-details
            ></v-switch>
            <v-card-subtitle class="red--text"
              >Remove all domains to disable this option</v-card-subtitle
            >
            <v-row v-if="auto_approve_email_ext">
              <v-col>
                <v-row>
                  <v-card-text
                    >Add email domains to be auto approved (example
                    edu.ng)</v-card-text
                  >
                  <v-col>
                    <span class="text--disabled">Current email domains: </span>
                    <span>{{ email_list }}</span>
                  </v-col>
                </v-row>
                <v-container>
                  <v-row v-for="i in email_list" :key="i">
                    <v-col cols="5">
                      <v-text-field
                        label="email extension"
                        :value="i"
                        dense
                        disabled
                        outlined
                      ></v-text-field>
                    </v-col>
                    <v-col cols="2">
                      <v-btn color="error" text @click.prevent="removeEmail(i)"
                        >Remove</v-btn
                      >
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="5">
                      <v-text-field
                        label="Email extension"
                        v-model="email_ext"
                        dense
                        outlined
                      ></v-text-field>
                    </v-col>
                    <v-col cols="5">
                      <v-btn color="green" text @click.prevent="addEmail"
                        >add</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-container>
              </v-col>
            </v-row>
            <v-switch
              v-model="course_charges"
              label="Enable course charges"
              color="primary"
              value=""
              hide-details
            ></v-switch>
            <v-row v-if="course_charges">
              <v-col>
                <v-row class="py-0 mb-0">
                  <v-col>
                    <span class="text--disabled">Course charge type: </span>
                    <v-radio-group v-model="charge_type" row>
                      <v-radio label="Fixed" :value="0"></v-radio>
                      <v-radio label="Percentage" :value="1"></v-radio>
                    </v-radio-group>
                  </v-col>
                </v-row>
                <v-row class="py-0">
                  <v-col>
                    <v-text-field
                      class="col-5"
                      v-model="amount"
                      label="charge amount"
                      dense
                      outlined
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row class="mt-10">
              <v-col>
                <v-btn large @click.prevent="updateSettings" color="error"
                  >Update settings</v-btn
                >
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </client-only>
</template>
<script>
import SettingsController from '~/api/admin/SettingsController'
export default {
  layout: 'admin',
  middleware: 'admin',
  data() {
    return {
      require_email: false,
      auto_approve_account: false,
      tutor_price: false,
      allow_review: false,
      course_charges: false,
      auto_approve_email_ext: false,
      email_ext: '',
      amount: 0,
      charge_type: '',
      email_list: [],
      index: 1
    }
  },
  methods: {
    addEmail() {
      this.email_list.push(this.email_ext)
      this.email_ext = ''
    },
    removeEmail(i) {
      let newList = this.email_list.filter(e => {
        return e != i
      })
      this.email_list = newList
    },
    updateSettings() {
      let charge = 'NO_CHARGE'
      let value
      if (this.course_charges) {
        if (this.charge_type == 1) {
          charge = 'PERCENT_CHARGE'
        } else {
          charge = 'FIXED_CHARGE'
        }
      }
      charge == 'NO_CHARGE' ? (value = 0) : (value = this.amount)

      let data = [
        {
          name: 'REQUIRE_EMAIL',
          value: this.require_email,
          type: typeof this.require_email
        },
        {
          name: 'APPROVE_ACCOUNTS',
          value: this.auto_approve_account,
          type: typeof this.auto_approve_account
        },
        {
          name: 'ALLOW_TUTOR_PRICE',
          value: this.tutor_price,
          type: typeof this.tutor_price
        },
        {
          name: 'ENABLE_REVIEW',
          value: this.allow_review,
          type: typeof this.allow_review
        },
        {
          name: 'AUTO_APPROVE_EMAIL_EXT',
          value: this.email_list,
          type: typeof this.email_list
        },
        { name: charge, value: value, type: typeof value }
      ]
      SettingsController.settings
        .set(data)
        .then(() => {
          this.getSettings()
          this.$notify({
            group: 'foo',
            title: 'Success',
            text: 'Settings updated',
            type: 'success'
          })
        })
        .catch(() => {
          this.$notify({
            group: 'foo',
            title: 'Error',
            text: 'Something went wrong',
            type: 'error'
          })
        })
    },
    getSettings() {
      SettingsController.settings
        .index()
        .then(res => {
          let settings = res.data.data
          settings.forEach(setting => {
            if (setting.name == 'AUTO_APPROVE_EMAIL_EXT') {
              let values = JSON.parse(setting.value)
              if (values.length > 0) {
                this.auto_approve_email_ext = true
                this.email_list = values
              } else {
                this.auto_approve_email_ext = false
              }
            }
            if (setting.name == 'ENABLE_REVIEW') {
              setting.value == 1
                ? (this.allow_review = true)
                : (this.allow_review = false)
            }
            if (setting.name == 'ALLOW_TUTOR_PRICE') {
              setting.value == 1
                ? (this.tutor_price = true)
                : (this.tutor_price = false)
            }
            if (setting.name == 'APPROVE_ACCOUNTS') {
              setting.value == 1
                ? (this.auto_approve_account = true)
                : (this.auto_approve_account = false)
            }
            if (setting.name == 'REQUIRE_EMAIL') {
              setting.value == 1
                ? (this.require_email = true)
                : (this.require_email = false)
            }
            if (setting.name == 'FIXED_CHARGE') {
              this.course_charges = true
              this.charge_type = 0
              this.amount = setting.value
            }
            if (setting.name == 'PERCENT_CHARGE') {
              this.course_charges = true
              this.charge_type = 1
              this.amount = setting.value
            }
          })
          this.$nuxt.$loading.finish()
        })
        .catch(() => {
          this.$nuxt.$loading.finish()
        })
    }
  },
  created() {
    this.getSettings()
  }
}
</script>
