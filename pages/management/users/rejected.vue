<template>
  <client-only>
    <div class="container">
      <v-row>
        <v-col cols="12">
          <v-card flat class="px-10">
            <v-card-title class="pb-10">
              <h3 class="text--disabled basil--text">
                Rejected Users
              </h3>
            </v-card-title>
            <!-- <v-btn
              color="primary text-capitalize"
              dark
              @click.prevent="newModal"
            >
              <v-icon>mdi-plus</v-icon> user
            </v-btn> -->

            <v-row>
              <v-col lg="4">
                <Searchbar
                  labelProp="search for user"
                  typeProp="users"
                  @reset="reloadPage"
                  @getSearchData="searchUsers"
                />
              </v-col>
              <v-spacer v-if="$vuetify.breakpoint.smAndDown" />
              <div class="col-5 col-lg-3 col-md-3">
                <v-select
                  @change="applyFilter"
                  :items="filters"
                  label="Filter users by role"
                  item-value="value"
                  item-text="name"
                  outlined
                  v-model="role"
                ></v-select>
              </div>
            </v-row>

            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">First Name</th>
                    <th class="text-left">Last Name</th>
                    <th class="text-left">Other Name</th>
                    <th class="text-left">Email</th>
                    <th class="text-left">Phone</th>
                    <th class="text-left">Joined At</th>
                    <th class="text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in users" :key="user.id">
                    <td>{{ user.first_name }}</td>
                    <td>{{ user.last_name }}</td>
                    <td>{{ user.other_name }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.phone }}</td>
                    <td>{{ user.created_at }}</td>
                    <td>
                      <v-row>
                        <v-icon
                          color="success"
                          class="mr-3"
                          @click.prevent="editUser(user)"
                          >mdi-pencil</v-icon
                        >
                        <v-icon class="mr-3" @click.prevent="viewUser(user)"
                          >mdi-eye</v-icon
                        >

                        <v-icon color="error" @click.prevent="destroy(user.id)"
                          >mdi-trash-can</v-icon
                        >
                      </v-row>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>

            <div class="d-flex justify-center text-center">
              <v-progress-circular
                v-if="!searchData && fetching"
                :size="40"
                :width="7"
                color="grey"
                indeterminate
              ></v-progress-circular>
            </div>
            <v-card v-if="!searchData" v-intersect="infiniteScrolling">
            </v-card>

            <!-- view user modal -->
            <div class="text-center">
              <v-row justify="center">
                <v-dialog v-model="dialog" max-width="750">
                  <v-card>
                    <v-card-title class="headline">
                      {{ form.name }}
                    </v-card-title>

                    <v-container>
                      User Details
                    </v-container>
                  </v-card>
                </v-dialog>
              </v-row>
            </div>
            <!-- end view user modal -->

            <!-- modal -->
            <div class="text-center">
              <v-row justify="center">
                <v-dialog v-model="dialog2" max-width="350">
                  <v-card>
                    <v-card-title class="headline">
                      Update {{ `${form.first_name} ${form.last_name}` }}
                    </v-card-title>

                    <v-container>
                      <v-select
                        :items="items"
                        label="--Update Status --"
                        item-value="value"
                        item-text="name"
                        v-model="form.status"
                        outlined
                      ></v-select>
                    </v-container>

                    <v-card-actions>
                      <v-spacer></v-spacer>

                      <v-btn
                        color="primary darken-1"
                        text
                        @click.prevent="update()"
                      >
                        Update
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-row>
            </div>
            <!-- end modal -->
          </v-card>
        </v-col>
      </v-row>
    </div>
  </client-only>
</template>
<script>
import UserController from '~/api/admin/UsersController'
import Searchbar from '~/components/Search'
import api from '~/api/general'
import { Form } from 'vform'
export default {
  layout: 'admin',
  middleware: 'admin',
  components: {
    Searchbar
  },
  data() {
    return {
      items: [
        { name: 'Aproved', value: 2 },
        { name: 'Rejected', value: 1 },
        { name: 'Pending', value: 0 }
      ],
      filters: [
        { name: 'All', value: 'all' },
        { name: 'Instructors', value: 'tutor' },
        { name: 'Students', value: 'student' }
      ],
      role: 'all',
      users: [],
      dialog: false,
      dialog2: false,
      form: new Form({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        username: '',
        id: ''
      }),
      searchData: false,
      filter: false,
      fetching: false,
      page: 1,
      nextPage: null
    }
  },
  methods: {
    applyFilter() {
      let value = this.role
      this.page = 1
      this.getUsers()
    },
    reloadPage() {
      this.searchData = false
      this.page = 1
      this.getUsers()
    },

    searchUsers(value) {
      let data = value
      if (data && data.length > 0) {
        this.searchData = true
        this.users = data
      } else {
        this.page = 1
        this.getUsers()
        this.searchData = false
      }
    },
    infiniteScrolling(entries, observer, isIntersecting) {
      this.fetching = true
      setTimeout(() => {
        this.page++
        if (this.nextPage != null) {
          UserController.user
            .rejected(this.role, this.page)
            .then(res => {
              let data = res.data.data.data
              let users = data.data
              this.nextPage = data.next_page_url
              if (users.length > 1) {
                users.forEach(user => this.users.push(user))
                this.fetching = false
              }
              this.fetching = false
            })
            .catch(err => {
              this.fetching = false
              console.log(err)
            })
        } else {
          this.fetching = false
        }
      }, 500)
    },
    editUser(user) {
      this.form.reset()
      this.edit = true
      this.form.fill(user)
      this.dialog2 = true
    },
    viewUser(user) {
      this.form.reset()
      this.edit = true
      this.form.fill(user)
      this.dialog = true
    },
    newModal() {
      this.edit = false
      this.form.reset()
      this.dialog = true
    },
    update() {
      let data = {
        status: this.form.status,
        id: this.form.id
      }
      UserController.user
        .update(data)
        .then(() => {
          this.getUsers()
          this.dialog2 = false
          this.$notify({
            group: 'foo',
            title: 'Success',
            text: 'User updated',
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
      this.$swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(result => {
        if (result.value) {
          UserController.user
            .delete(id, 'temp')
            .then(() => {
              this.getUsers()
              this.$notify({
                group: 'foo',
                title: 'Success',
                text: 'User deleted',
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
        }
      })
    },
    getUsers() {
      UserController.user
        .rejected(this.role, this.page)
        .then(res => {
          let data = res.data.data.data
          this.users = data.data
          this.nextPage = data.next_page_url
          this.$nuxt.$loading.finish()
        })
        .catch(() => {
          this.$nuxt.$loading.finish()
        })
    }
  },
  created() {
    this.getUsers()
  },
  mounted() {
    this.$nuxt.$loading.start()
  }
}
</script>
