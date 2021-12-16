<template>
  <div>
    <v-container>
      <div class="row">
        <v-col>
          <div class="font-weight-medium display-1 mt-10">Overview</div>
        </v-col>
      </div>
      <v-row>
        <div class="col-lg-2 col-md-12">
          <v-card>
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline mb-4">Total revenue</div>
                <v-list-item-title class="headline mb-1">
                  {{ currency }}{{ formatedRevenue }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ currency }}{{ formatedMonthTotal }}
                  this month
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </div>
        <div class="col-lg-2 col-md-12">
          <v-card>
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline mb-4">Enrollments</div>
                <v-list-item-title class="headline mb-1">
                  {{ total_enrollments }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ month_enrollments }} this month
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </div>
        <div class="col-lg-2 col-md-12">
          <v-card>
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline mb-4">Instructor rating</div>
                <v-list-item-title class="headline mb-1">
                  {{ ratings }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ month_ratings }} this month
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </div>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import PerformanceController from '~/api/instructor/PerformanceController'
export default {
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
  },
  computed: {
    formatedRevenue() {
      return parseFloat(this.total)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')
    },
    formatedMonthTotal() {
      return parseFloat(this.month_total)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')
    }
  }
}
</script>
