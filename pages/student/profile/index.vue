<template>
  <div class="container">
    <client-only>
      <div class="row">
        <v-col>
          <div class="font-weight-medium display-1 mt-10">
            Profile and Security
          </div>
        </v-col>
      </div>
      <v-row>
        <v-col cols="12">
          <v-card color="basil" flat>
            <v-tabs
              background-color="transparent"
              color="basil"
              grow
              v-model="tab"
            >
              <v-tab v-for="item in items" :key="item">
                {{ item }}
              </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
              <v-tab-item v-for="item in items" :key="item">
                <v-card color="basil" flat>
                  <Basic v-if="item == 'Basic'" />
                  <Picture v-if="item == 'Picture'" />
                  <Security v-if="item == 'Security'" />
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-col>
      </v-row>
    </client-only>
  </div>
</template>
<script>
import Basic from './basic'
import Security from './security'
import Picture from './picture'
export default {
  middleware: ['student'],
  layout: 'studentSidebar',
  components: {
    Basic,
    Security,
    Picture
  },
  data() {
    return {
      tab: null,
      items: ['Basic', 'Picture', 'Security']
    }
  },
  methods: {},
  created() {}
}
</script>
