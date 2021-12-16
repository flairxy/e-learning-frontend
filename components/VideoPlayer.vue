<template>
  <div>
    <video-player
      class="video-player-box"
      ref="videoPlayer"
      :options="playerOptions"
      :playsinline="true"
      customEventName="customstatechangedeventname"
      @play="onPlayerPlay($event)"
      @pause="onPlayerPause($event)"
      @ended="onPlayerEnded($event)"
      @ready="playerReadied"
      @timeupdate="onPlayerTimeupdate($event)"
    >
    </video-player>
  </div>
</template>
<script>
export default {
  props: {
    height: {
      required: true,
      type: String
    },
    width: {
      required: true,
      type: String
    },
    currentVideo: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      playerOptions: {
        // videojs options
        height: this.height,
        width: this.width,
        muted: true,
        language: 'en',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [
          {
            type: 'video/mp4',
            src: this.currentVideo
          }
        ]
        // poster: '/static/images/author.jpg'
      }
    }
  },

  computed: {
    player() {
      return this.$refs.videoPlayer.player
    }
  },
  methods: {
    // listen event
    onPlayerPlay(player) {
      // console.log('player play!', player)
    },
    onPlayerPause(player) {
      // console.log('player pause!', player)
    },
    // ...player event
    onPlayerTimeupdate(player) {
      console.log('player time update', player)
    },

    // player is ready
    playerReadied(player) {
      console.log('the player is readied', player)
      // you can use it to do something...
      // player.[methods]
    },
    onPlayerEnded(player) {
      console.log('the player is ended', player)
      // you can use it to do something...
      // player.[methods]
    }
  }
}
</script>
