<template>
  <div>
    <v-simple-table>
      <tr v-for="dataset in allDatasets" :key="dataset.id">
        <v-card
        elevation="2"
        outlined
        tile
        :to="'/dataset/'+dataset.id+'/alldatatables'"
        >
          <v-card-title>{{ dataset.name }}</v-card-title>
          <v-card-subtitle>{{ dataset.description }}</v-card-subtitle>
        </v-card>
      </tr>
    </v-simple-table>
  </div>
</template>

<script>
import DatasetService from '@/api/DatasetService'

export default {
  data() {
    return {
      allDatasets: []
    }
  },
  methods: {
    getAllDatasets() {
      DatasetService.getAllDatasets()
        .then(response => {
          this.allDatasets=response.data;
        })
        .catch(e => console.log(e))
    }
  },
  created() {
    this.getAllDatasets();
  }
}
</script>
