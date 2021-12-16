<template>
  <div class="meeting">
    <div class="container-zoom">
      <ZoomFrame
        :nickname="username"
        :meetingId="meetingId"
        :password="password"
        :role="1"
        :email="email"
      />
    </div>
  </div>
</template>

<script>
import ZoomFrame from '~/components/ZoomFrame'
export default {
  middleware: ['instructor'],
  layout: 'instructorSidebar',
  data: function() {
    return {
      username: '',
      meetingId: '',
      password: '',
      email: ''
    }
  },
  components: {
    ZoomFrame
  },
  created: function() {
    this.password = this.$route.query.password
    this.meetingId = this.$route.query.meetingId
    this.email = this.$route.query.email
    this.username = this.$route.query.username
    this.role = this.$route.query.role
  }
}
</script>

<style>
.container-zoom {
  width: 70%;
  height: 100%;
}
</style>
