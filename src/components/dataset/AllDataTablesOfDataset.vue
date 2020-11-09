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
      <v-card-subtitle>
        Dataset Name: {{ dataTablesOfDataset[0].datasetName }}
      </v-card-subtitle>
      <v-data-table
        :headers="headers"
        :items="dataTablesOfDataset"
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
import DataTableService from '@/api/DataTableService';

export default {
  data: function() {
    return {
      dataTablesOfDataset: [],
      search: '',
      headers: [
        {text: 'Name', value: 'name'},
        {text: 'Description', value: 'description'},
        {text: 'Created by', value: 'officerPf'}
      ],
      datasetId: this.$route.params.datasetId
    }
  },
  created() {
    this.getDataTablesOfDataset(this.datasetId);
  },
  methods: {
    getDataTablesOfDataset(datasetId) {
      DataTableService.getDataTablesForDataset(datasetId)
        .then(response => {
          this.dataTablesOfDataset=response.data;
        })
    }
  }
}
</script>