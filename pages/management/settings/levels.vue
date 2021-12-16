<template>
  <client-only>
    <div class="container">
      <v-row>
        <v-col cols="12">
          <v-card flat class="px-10">
            <v-card-title class="mb-10">
              <h3 class="text--disabled basil--text">
                Levels
              </h3>
            </v-card-title>
            <v-btn
              color="primary text-capitalize"
              dark
              @click.prevent="newModal"
            >
              <v-icon>mdi-plus</v-icon> level
            </v-btn>

            <v-simple-table fixed-header height="300px">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Name</th>
                    <th class="text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="level in levels" :key="level.id">
                    <td>{{ level.name }}</td>
                    <td>
                      <v-row>
                        <v-btn
                          small
                          class="mr-3"
                          @click.prevent="editLevel(level)"
                        >
                          <v-icon>mdi-pencil</v-icon> Edit</v-btn
                        >
                        <v-btn small @click.prevent="destroy(level.id)">
                          <v-icon>mdi-trash</v-icon> Delete</v-btn
                        >
                      </v-row>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>

            <!-- modal -->
            <div class="text-center">
              <v-row justify="center">
                <v-dialog v-model="dialog" max-width="350">
                  <v-card>
                    <v-card-title class="headline">
                      {{ !edit ? 'New Level' : 'Update Level' }}
                    </v-card-title>

                    <v-container>
                      <v-text-field
                        label="Level Name"
                        v-model="form.name"
                        dense
                        outlined
                      ></v-text-field>
                    </v-container>

                    <v-card-actions>
                      <v-spacer></v-spacer>

                      <v-btn
                        color="primary darken-1"
                        text
                        @click.prevent="edit ? update() : create()"
                      >
                        {{ edit ? 'Update' : 'Create' }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-row>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </client-only>
</template>
<script>
import GeneralController from '~/api/general'
import { Form } from 'vform'
export default {
  layout: 'admin',
  middleware: 'admin',
  data() {
    return {
      levels: [],
      edit: false,
      dialog: false,
      form: new Form({
        name: '',
        id: ''
      })
    }
  },
  methods: {
    editLevel(level) {
      this.form.reset()
      this.edit = true
      this.form.fill(level)
      this.dialog = true
    },
    newModal() {
      this.edit = false
      this.form.reset()
      this.dialog = true
    },
    create() {
      let data = {
        name: this.form.name
      }
      GeneralController.level
        .create(data)
        .then(() => {
          this.index()
          this.dialog = false
          this.$notify({
            group: 'foo',
            title: 'Success',
            text: 'Level saved',
            type: 'success'
          })
        })
        .catch(() => {
          this.$notify({
            group: 'foo',
            title: 'Error',
            text: 'Something went wrong',
            type: 'error'
          })
        })
    },
    update() {
      let data = {
        name: this.form.name,
        id: this.form.id
      }
      GeneralController.level
        .update(data)
        .then(() => {
          this.index()
          this.dialog = false
          this.$notify({
            group: 'foo',
            title: 'Success',
            text: 'Level updated',
            type: 'success'
          })
        })
        .catch(() => {
          this.$notify({
            group: 'foo',
            title: 'Error',
            text: 'Something went wrong',
            type: 'error'
          })
        })
    },
    destroy(id) {
      GeneralController.level
        .delete(id)
        .then(() => {
          this.index()
          this.dialog = false
          this.$notify({
            group: 'foo',
            title: 'Success',
            text: 'Level deleted',
            type: 'success'
          })
        })
        .catch(() => {
          this.$notify({
            group: 'foo',
            title: 'Error',
            text: 'Something went wrong',
            type: 'error'
          })
        })
    },
    index() {
      GeneralController.level
        .get()
        .then(res => {
          this.levels = res.data.data
          this.$nuxt.$loading.finish()
        })
        .catch(() => {
          this.$nuxt.$loading.finish()
        })
    }
  },
  created() {
    this.index()
  }
}
</script>
