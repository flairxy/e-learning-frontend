<template>
  <div>
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
