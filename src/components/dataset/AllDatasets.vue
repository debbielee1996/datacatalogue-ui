<template>
  <v-container>
    <v-card>
      <v-card-title>
        Datasets
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
        :items="allDatasets"
        :search="search"
      >
        <template v-slot:[`item.name`]="{ item }">
          <a :href="'/dataset/'+item.id+'/alldatatables'">
            {{ item.name }}
          </a>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import DatasetService from '@/api/DatasetService'

export default {
  data() {
    return {
      allDatasets: [],
      search: '',
      headers: [
        {text: 'Name', value: 'name'},
        {text: 'Description', value: 'description'},
        {text: 'Created By', value: 'officerPf'}
      ]
    }
  },
  methods: {
    getAllDatasetDtos() {
      DatasetService.getAllDatasetDtos()
        .then(response => {
          this.allDatasets=response.data;
        })
        .catch(e => console.log(e))
    }
  },
  created() {
    this.getAllDatasetDtos();
  }
}
</script>
