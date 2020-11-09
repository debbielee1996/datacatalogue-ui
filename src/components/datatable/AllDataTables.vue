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
        <template v-slot:[`item.name`]="{ item }">
          <a :href="'/datatable/'+item.id+'/allcolumns'">
            {{ item.name }}
          </a>
        </template>

        <template v-slot:[`item.officerPf`]="{ item }">
          <mark
            v-if="item.officerPf==1001"
            style="background-color:#DEFABB"
          ><b>{{ item.officerPf }}</b></mark>
          <div v-else>{{ item.officerPf }}</div>
        </template>

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
        {text: 'Description', value: 'description'},
        {text: 'Created By', value: 'officerPf'},
        {text: 'Dataset Name', value: 'datasetName'}
      ]
    }
  },
  methods: {
    getAllDataTableDtos() {
      DataTableService.getAllDataTableDtos()
        .then(response => {
          this.allDataTables=response.data;
        })
        .catch(e => console.log(e))
    }
  },
  created() {
    this.getAllDataTableDtos();
  }
}
</script>
