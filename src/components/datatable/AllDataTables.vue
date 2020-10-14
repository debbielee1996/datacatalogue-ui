<template>
  <v-container>
    <v-card>
      <v-card-title>
        Data Tables
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="allDataTables"
        :search="search"
      >
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import DataTableService from '@/api/DataTableService'

export default {
  data() {
    return {
      allDataTables: [],
      search: '',
      headers: [
        {text: 'Name', value: 'name'},
        {text: 'Description', value: 'description'}
      ]
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
