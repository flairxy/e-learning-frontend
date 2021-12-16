<template>
  <div class="iframe-container"></div>
</template>
<script>
import { ZoomMtg } from '@zoomus/websdk'
export default {
  props: {
    nickname: String,
    meetingId: String,
    email: String,
    password: String,
    role: Number
  },
  mounted() {
    console.log('checkSystemRequirements')

    console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()))

    // CDN version default

    ZoomMtg.setZoomJSLib(
      'https://dmogdx0jrul3u.cloudfront.net/1.7.9/lib',
      '/av'
    )

    ZoomMtg.preLoadWasm()

    ZoomMtg.prepareJssdk()

    var API_KEY = 'Voo1PWUMcQKg87Qn4Y6W7BnCWQAWc3u0anVe'
    var API_SECRET = 'tYZuQX3qKay4RDlxc2HGXH30YAZk6Phzgfi8'

    const meetConfig = {
      apiKey: API_KEY,
      apiSecret: API_SECRET,
      meetingNumber: this.meetingId,
      userName: this.nickname,
      passWord: this.password,
      leaveUrl: 'https://zoom.us',
      role: this.role
    }

    const signature = ZoomMtg.generateSignature({
      meetingNumber: meetConfig.meetingNumber,
      apiKey: meetConfig.apiKey,
      apiSecret: meetConfig.apiSecret,
      role: meetConfig.role,
      success: function(res) {
        // eslint-disable-next-line
        console.log('success signature: ' + res.result)
      }
    })

    // join function

    ZoomMtg.init({
      leaveUrl: 'http://www.zoom.us',
      isSupportAV: true,
      success: () => {
        ZoomMtg.join({
          meetingNumber: meetConfig.meetingNumber,
          userName: meetConfig.userName,
          signature: signature,
          apiKey: meetConfig.apiKey,
          userEmail: 'email@gmail.com',
          passWord: meetConfig.passWord,
          success: function(res) {
            // eslint-disable-next-line
            console.log('join meeting success')
          },
          error: function(res) {
            // eslint-disable-next-line
            console.log(res)
          }
        })
      },

      error: function(res) {
        // eslint-disable-next-line

        console.log(res)
      }
    })
  }
}
</script>
