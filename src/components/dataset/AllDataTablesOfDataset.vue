<template>
  <div>
    <v-simple-table>
      <tr >
        <v-card
        elevation="2"
        outlined
        tile
        v-for="dataTable in dataTablesOfDataset" :key="dataTable.id"
        >
          <v-card-title>{{ dataTable.name }}</v-card-title>
          <v-card-subtitle>{{ dataTable.description }}</v-card-subtitle>
        </v-card>
      </tr>
    </v-simple-table>
  </div>
</template>

<script>
import DataSetService from '@/api/DatasetService';

export default {
  data: function() {
    return {
      dataTablesOfDataset: [],
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