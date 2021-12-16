<template>
  <div>
    <div class="row">
      <v-col>
        <div class="font-weight-medium display-1 mt-10">Reviews</div>
      </v-col>
    </div>
    <v-row dense v-if="reviews.length > 0">
      <v-col cols="8">
        <v-card
          outlined
          shaped
          class="py-0 pointer"
          v-for="review in reviews"
          :key="review.id"
        >
          <v-list-item>
            <v-list-item-content>
              <div class="overline mb-4">{{ review.course }}</div>
              <v-list-item-title class="subtitle">
                {{ review.student }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ review.body }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-card-actions class="pa-4 pt-0">
            <v-rating
              v-model="review.rating "
              background-color="white"
              color="yellow accent-4"
              dense
              half-increments
              readonly
              size="18"
            ></v-rating>
            <span class="grey--text caption ml-2">
              ({{ review.rating  }})
            </span>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <div
          :class="
            `font-weight-light text-center text ${
              $vuetify.breakpoint.smAndDown ? 'headline' : 'display-1'
            } mt-10`
          "
        >
          No reviews yet...
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import PerformanceController from '~/api/instructor/PerformanceController'
export default {
  data() {
    return {
      reviews: []
    }
  },
  methods: {
    getReviews() {
      let data = {
        user: this.$store.state.user.id
      }
      PerformanceController.overview.reviews(data).then(res => {
        this.reviews = res.data.data
      })
    }
  },
  created() {
    this.getReviews()
  }
}
</script>
