<template>
  <div>
    <div class="row">
      <v-col>
        <div class="font-weight-medium display-1 mt-10">
          Traffic & conversion
        </div>
      </v-col>
    </div>
    <v-row>
      <v-col>
        <div
          :class="
            `font-weight-light text-center text ${
              $vuetify.breakpoint.smAndDown ? 'headline' : 'display-1'
            } mt-10`
          "
        >
          Coming Soon...
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {}
</script>
