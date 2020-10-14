<template>
  <div>
      <v-simple-table>
        <tr
        v-for="dataTable in allDataTables" :key="dataTable.id">
          <v-card
          elevation="2"
          outlined
          tile>
            <v-card-title>{{ dataTable.name }}</v-card-title>
            <v-card-subtitle>{{ dataTable.description }}</v-card-subtitle>
          </v-card>
        </tr>
      </v-simple-table>


  </div>
</template>

<script>
import DataTableService from '@/api/DataTableService'

export default {
  data() {
    return {
      allDataTables: []
    }
  },
  methods: {
    getAllDataTables() {
      DataTableService.getAllDataTables()
        .then(response => {
          this.allDataTables=response.data;
        })
        .catch(e => console.log(e))
    }
  },
  created() {
    this.getAllDataTables();
  }
}
</script>
