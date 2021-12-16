<template>
  <div class="container">
    <client-only>
      <div class="row">
        <v-col>
          <div class="font-weight-medium display-1 mt-10">Overview</div>
        </v-col>
      </div>
      <div class="row">
        <v-col lg="2" md="4" sm="4" class="px-0">
          <v-card>
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline mb-4">Total revenue</div>
                <v-list-item-title class="headline mb-1">
                  {{ currency
                  }}{{
                    parseFloat(total)
                      .toFixed(2)
                      .replace(/\d(?=(\d{3})+\.)/g, '$&,')
                  }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ currency
                  }}{{
                    parseFloat(month_total)
                      .toFixed(2)
                      .replace(/\d(?=(\d{3})+\.)/g, '$&,')
                  }}
                  this month
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col class="px-0" lg="2" md="4" sm="4">
          <v-card>
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline mb-4">Total tutors</div>
                <v-list-item-title class="headline mb-1">
                  0
                </v-list-item-title>
                <v-list-item-subtitle>
                  0 this month
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col class="px-0" lg="2" md="4" sm="4">
          <v-card>
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline mb-4">Total students</div>
                <v-list-item-title class="headline mb-1">
                  0
                </v-list-item-title>
                <v-list-item-subtitle>
                  0 this month
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col class="px-0" lg="2" md="4" sm="4">
          <v-card>
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline mb-4">Total courses</div>
                <v-list-item-title class="headline mb-1">
                  0
                </v-list-item-title>
                <v-list-item-subtitle>
                  0 this month
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </div>
    </client-only>
  </div>
</template>
<script>
import PerformanceController from '~/api/instructor/PerformanceController'
export default {
  layout: 'admin',
  middleware: 'admin',
  data() {
    return {
      currency: process.env.CURRENCY,
      total: 0,
      month_total: 0,
      total_enrollments: 0,
      month_enrollments: 0,
      month_ratings: 0,
      ratings: 0
    }
  },
  methods: {
    overview() {
      let data = {
        user: this.$store.state.user.id
      }
      PerformanceController.overview.index(data).then(res => {
        let info = res.data.data
        this.total = info.total_earnings
        this.month_total = info.month_earnings
        this.total_enrollments = info.total_enrollments
        this.month_enrollments = info.month_enrollments
        this.month_ratings = info.month_ratings
        this.ratings = info.ratings
      })
    }
  },
  created() {
    this.overview()
  }
}
</script>
