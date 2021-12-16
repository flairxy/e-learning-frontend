<template>
  <div class="mt-10">
    <v-col :cols="$vuetify.breakpoint.mdAndUp ? '6' : '12'">
      <p class="text--disabled subtitle-2">
        Minimum 200x200 pixels, Maximum 6000x6000 pixels
      </p>
      <div flat outlined class="d-flex justify-center">
        <div width="50%" height="50%">
          <v-img v-if="!imageUrl" src="/user.png" />
          <v-avatar width="200" height="200" rounded v-else>
            <img :src="imageUrl" alt="avatar" />
          </v-avatar>
        </div>
      </div>
    </v-col>
    <v-col :cols="$vuetify.breakpoint.mdAndUp ? '6' : '12'">
      <br />
      <S3FileUpload
        @preview-image="previewImage"
        @getUrl="saveImage"
        :currentFile="imageUrl"
        buttonText="Save image"
        directory="avatars"
        label="Profile Picture"
        rules=".jpeg, .jpg, .png"
        contentType="image"
      />
    </v-col>
  </div>
</template>
<script>
import S3FileUpload from '@/components/S3FileUpload'
import api from '~/api/index'
export default {
  components: {
    S3FileUpload
  },
  data() {
    return {
      imageUrl: '',
      uploadObject: null
    }
  },
  methods: {
    previewImage(value) {
      this.imageUrl = URL.createObjectURL(value)
    },
    saveImage(value) {
      let user = this.$store.state.user
      let data = {
        image_url: value,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        phone: user.phone
      }
      api.auth
        .update(data)
        .then(async res => {
          try {
            let res = await api.auth.me()
            await this.$store.commit('SET_USER', res.data.data)
            this.$notify({
              group: 'foo',
              title: 'Success',
              text: 'Profile picture saved',
              type: 'success'
            })
          } catch (error) {
            this.$notify({
              group: 'foo',
              title: 'Failed',
              text: 'Something went wrong',
              type: 'error'
            })
          }
        })
        .catch(error => {
          this.$notify({
            group: 'foo',
            title: 'Failed',
            text: 'Something went wrong',
            type: 'error'
          })
        })
    },
    getImage() {
      let user = this.$store.state.user
      this.imageUrl = user.account.image_url
    }
  },
  created() {
    this.getImage()
  }
}
</script>
