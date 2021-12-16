<template>
  <div>
    <div class="row">
      <v-col>
        <div class="font-weight-medium display-1 mt-10">Students</div>
      </v-col>
    </div>
    <v-simple-table v-if="students.length > 0" fixed-header height="300px">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Email</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.id">
            <td>{{ `${student.first_name} ${student.last_name}` }}</td>
            <td>{{ student.email }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-row v-else>
      <v-col>
        <div
          :class="
            `font-weight-light text-center text ${
              $vuetify.breakpoint.smAndDown ? 'headline' : 'display-1'
            } mt-10`
          "
        >
          No students yet...
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import PerformanceController from '~/api/instructor/PerformanceController'

export default {
  data() {
    return {
      students: []
    }
  },
  methods: {
    getStudents() {
      let data = {
        user: this.$store.state.user.id
      }
      PerformanceController.overview.students(data).then(res => {
        this.students = res.data.data
      })
    }
  },
  created() {
    this.getStudents()
  }
}
</script>
