<template>
  <v-form v-model="valid">
    <v-text-field
      v-model="video.name"
      label="Name"
    />
    <v-checkbox v-model="video.pro" label="Pro" />
    <v-text-field v-model="video.duration" label="Duration (in seconds)">
      <template #prepend>
        <span class="duration-display">
          <DurationDisplay :duration="video.duration" />
        </span>
      </template>
    </v-text-field>

    <v-row>
      <v-col cols="12" sm="9" md="10">
        <S3FileUpload
          :obj="video"
          fieldName="videoUrl"
          directory="videos"
          label="Video File"
        />
        <S3FileUpload
          :obj="video"
          fieldName="thumbnail"
          directory="thumbnails"
          label="Thumbnail Image"
        />
      </v-col>
    </v-row>

    <v-datetime-picker label="Select Datetime" v-model="video.published_at">
    </v-datetime-picker>

    <v-btn @click="saveVideo" :disabled="!valid">Save image</v-btn>
  </v-form>
</template>

<script>
// import validations from '@/utils/validations';
import DurationDisplay from '@/components/DurationDisplay'
// import MarkdownEditor from '@/components/MarkdownEditor';
import VideoWatch from '@/components/VideoWatch'
import S3FileUpload from '@/components/S3FileUpload'

export default {
  components: {
    DurationDisplay,
    S3FileUpload
  },
  data() {
    return {
      valid: false,
      video: {}
    }
  },
  methods: {
    saveVideo(){}
  }
}
</script>

<style lang="scss" scoped>
.duration-display {
  background-color: grey;
  color: white;
  border-radius: 5px;
  padding: 7px;
}
</style>
