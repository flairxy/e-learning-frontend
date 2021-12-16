<template>
  <div>
    <div v-if="isLoading">
      <v-progress-linear
        :value="percentage"
        striped
        height="10"
        color="cyan darken-2"
      >
      </v-progress-linear>
      <p>Uploading your file, please wait...</p>
    </div>
    <div v-else>
      <v-file-input
        append-icon="mdi-paperclip"
        v-model="uploadObject"
        :accept="rules"
        @change="uploadFile"
        :label="label"
        truncate-length="125"
        :clearable="false"
        prepend-icon=""
        outlined
      />
      <video id="video"></video>
      <!-- <v-btn
        v-if="
          contentType != 'document' &&
            contentType != 'video' &&
            directory != 'avatars'
        "
        class="text-capitalize"
        @click.prevent="saveFile"
        >{{ buttonText }}</v-btn
      > -->
    </div>

    <v-row justify="center">
      <v-dialog v-model="fileDialog" persistent max-width="500px">
        <v-card class="text-center">
          <v-card-title>
            <span class="headline"> Replace current File?</span>
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              v-if="!deleting"
              color="blue darken-1"
              text
              @click="noDeleteFile()"
              >No</v-btn
            >

            <v-btn
              v-if="!deleting"
              color="blue darken-1"
              text
              @click.prevent="deleteFile()"
              >Yes</v-btn
            >
            <v-btn v-else color="blue darken-1" :loading="true" disabled
              ><v-icon dark>mdi-cloud-upload</v-icon></v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import courseController from '~/api/instructor/courseController'

export default {
  data() {
    return {
      fileDialog: false,
      deleting: false,
      dialog: false,
      isLoading: false,
      uploadObject: {},
      fileUrl: null,
      video_seconds: null,
      percentage: 0,
      currentFileStatus: this.currentFile
    }
  },
  computed: {
    getExt() {
      let filename = this.uploadObject.name
      return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
    }
  },
  methods: {
    makeid(length) {
      var result = ''
      var characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      var charactersLength = characters.length
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        )
      }
      return result
    },
    async uploadFile(e) {
      try {
        if (this.directory == 'videos') {
          let objectUrl
          let file = this.uploadObject
          objectUrl = URL.createObjectURL(file)
          $('#video').prop('src', objectUrl)

          let self = this
          $('#video').on('canplaythrough', function(e) {
            let seconds = Math.floor(e.currentTarget.duration)
            console.log(seconds)
            // self.$emit('storeLength', seconds)
            self.video_seconds = seconds
            self.preview()
          })
        } else {
          this.preview()
        }
      } catch (error) {
        console.log(error)
      }
    },
    handleProgress(percentComplete) {
      console.log(percentComplete.toString() + '%')
    },

    handleSuccess() {
      let data = {
        course_id: this.courseId,
        url: this.fileUrl,
        content_id: this.contentId
      }
      if (this.directory == 'avatars') {
        this.currentFileStatus = this.fileUrl
        this.$emit('getUrl', this.fileUrl)
        this.isLoading = false
        return
      }
      if (this.contentType == 'image') {
        this.isLoading = false
        this.$notify({
          group: 'foo',
          title: 'Success!!',
          text: 'Upload successful!!',
          type: 'success'
        })
        this.$emit('saveUrl', this.fileUrl)
        this.currentFileStatus = this.fileUrl
        this.isLoading = false
        return
      }
      if (this.contentType == 'video') {
        data.video = true
      }
      if (this.contentType == 'document') {
        data.document = true
      }
      courseController.course.updateFiles(data).then(() => {
        this.isLoading = false
        this.$emit('reload')
        this.$notify({
          group: 'foo',
          title: 'Success!!',
          type: 'success'
        })
      })
    },

    handleError() {
      this.$emit('uploadFailed')
      this.$emit('uploadFailed')
      this.isLoading = false
      return
    },
    // saveFile() {
    //   this.$emit('imageUrl', file)
    // },
    preview() {
      let file = this.uploadObject
      if (this.directory == 'videos' || this.directory == 'documents') {
        if (this.currentFileStatus != null) {
          this.fileDialog = true
          return
        } else {
          this.startUpload()
        }
      }

      if (this.directory == 'avatars' || this.directory == 'images') {
        if (this.currentFileStatus != null) {
          this.fileDialog = true
          return
        } else {
          this.$emit('preview-image', file)
          this.startUpload()
        }
      }
    },
    async startUpload() {
      try {
        this.isLoading = true
        let file = this.uploadObject
        let fileData = {
          filename: this.makeid(8) + Date.now() + '.' + this.getExt,
          directory: this.directory,
          courseId: this.courseId,
          contentId: this.contentId,
          type: 'upload',
          duration: this.video_seconds
        }
        // oldFile: key,
        let response = await courseController.content.files(fileData)
        let attributes = response.data.data.attributes
        let inputs = response.data.data.inputs
        // const url = response.data.data
        const url = response.data.data.url
        // let awsURL =
        //   url.split('.com/').shift() +
        //   '.com/' +
        //   fileData.directory +
        //   '/' +
        //   fileData.filename
        // console.log(awsURL)
        // this.fileUrl = awsURL
        this.fileUrl = url
        const formData = new FormData()
        Object.keys(inputs).forEach(key => {
          formData.append(key, inputs[key])
        })
        formData.append('file', file)
        let xhr = new XMLHttpRequest()
        xhr.upload.addEventListener('progress', uploadProgress, false)
        xhr.addEventListener('load', uploadComplete, false)
        xhr.addEventListener('error', this.uploadFailed, false)
        xhr.addEventListener('abort', uploadCanceled, false)
        xhr.open('POST', attributes.action, true)
        // xhr.open('PUT', url, true)
        xhr.send(formData)
        const self = this
        function uploadComplete(evt) {
          if (evt.target.status == 204) {
            // if (evt.target.status == 200) {
            self.handleSuccess()
          } else {
            self.handleError()
          }
        }
        function uploadProgress(evt) {
          if (evt.lengthComputable) {
            let percentComplete = Math.round((evt.loaded * 100) / evt.total)
            self.percentage = percentComplete
          }
        }
        function uploadFailed(evt) {
          self.isLoading = false
          self.handleError()
        }
        function uploadCanceled(evt) {
          console.log(
            'The upload has been canceled by the user or the browser dropped the connection.'
          )
          self.handleError()
        }
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.handleError()
      }
    },
    noDeleteFile() {
      this.fileDialog = false
    },
    async deleteFile() {
      try {
        this.deleting = true
        let key = this.currentFile.split('.com/').pop()
        let data = {
          oldFile: key,
          directory: this.directory,
          user: this.$store.state.user.id,
          courseId: this.courseId,
          contentId: this.contentId,
          type: 'upload'
        }
        let response = await courseController.content.files(data)
        this.deleting = false
        this.fileDialog = false
        this.currentFileStatus = null
        this.uploadFile()
        this.$notify({
          title: 'Success',
          text: 'file deleted',
          group: 'foo',
          type: 'success'
        })
      } catch (error) {
        console.log(error)
        this.fileDialog = false
        this.deleting = false
        this.$notify({
          title: 'Failed',
          text: 'Something went wrong',
          group: 'foo',
          type: 'error'
        })
      }
    }
  },
  props: {
    directory: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    buttonText: {
      type: String,
      required: true
    },
    rules: {
      type: String
    },
    courseId: {
      type: String
    },
    contentId: {
      type: Number
    },
    contentType: {
      type: String
    },
    currentFile: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
video {
  display: none;
}
</style>
