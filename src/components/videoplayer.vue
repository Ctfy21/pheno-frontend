<template>
  <div>
    <video
      ref="videoJsPlayer"
      class="video-js vjs-defaultskin"
    />
  </div>
</template>
<script>
  import videojs from 'video.js';
  import 'video.js/dist/video-js.css'

  export default {
    name: 'VideoJsPlayer',
    data () {
      return {
        player: null,
        videoOptions: {
          autoplay: true,
          controls: true,
          preload: true,
          fluid: true,
          sources: [
            {
              src:
                'https://media.geeksforgeeks.org/wp-content/uploads/20240514215354/Untitled-design-(8).mp4',
              type: 'video/mp4',
            },
          ],
        },
      };
    },
    beforeUnmount () {
      if (this.player) {
        this.player.dispose();
      }
    },
    mounted () {
      this.player = videojs(
        this.$refs.videoJsPlayer,
        {
          ...this.videoOptions,
          // innerHeight: 360,
          // innerWidth: 640,
        },
        () => {
          this.player.log('video player ready', this)
        }
      );
    },
  };
</script>

<style scoped>
video {
  width: 400px;
}
</style>
