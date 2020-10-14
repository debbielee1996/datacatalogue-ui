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
        :items="dataTablesOfDataset"
        :search="search"
      >
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import DataSetService from '@/api/DatasetService';

export default {
  data: function() {
    return {
      dataTablesOfDataset: [],
      search: '',
      headers: [
        {text: 'Name', value: 'name'},
        {text: 'Description', value: 'description'}
      ],
      datasetId: this.$route.params.datasetId
    }
  },
  created() {
    this.getDataTablesOfDataset(this.datasetId);
  },
  methods: {
    getDataTablesOfDataset(datasetId) {
      DataSetService.getDataTablesForDataset(datasetId)
        .then(response => {
          this.dataTablesOfDataset=response.data;
        })
    }
  }
}
</script>