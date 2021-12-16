<template>
  <v-footer dark class="mt-30 v-bg">
    <div class="col-12 text-center">
      <v-card flat tile class=" white--text text-center">
        <v-card-text>
          <v-btn
            v-for="icon in icons"
            :key="icon"
            class="mx-4 white--text"
            icon
          >
            <v-icon size="24px">{{ icon }}</v-icon>
          </v-btn>
        </v-card-text>

        <v-card-text class="white--text pt-0">
          We are a leading provider of ICT infrastructure and
          technology-consulting services deep in the heart of Africa with a
          habit of getting things done and looking good at it.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-text class="white--text">
          {{ new Date().getFullYear() }} —
          <strong> Invoge Integrated Services LTD | All rights reserved</strong>
        </v-card-text>
      </v-card>
    </div>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    icons: ['mdi-facebook', 'mdi-twitter', 'mdi-linkedin', 'mdi-instagram']
  })
}
</script>
<style>
.mt-30 {
  margin-top: 70px !important;
}
.v-bg {
  background-color: #1e1e1e !important;
}
</style>
