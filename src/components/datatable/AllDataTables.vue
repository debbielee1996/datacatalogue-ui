<template>
  <v-container>
    <v-card>
      <v-card-title>
        {{ this.allDataTablesLength }} data table(s) found
        <v-spacer></v-spacer>
         <v-card-actions>

          <!-- button to go to AllPublicDataTables page -->
         <v-btn color="blue darken-1">
          <a style="text-decoration: none; color:white;" :href="'/allpublicdatatables'">View Public DataTables</a></v-btn>
      
       </v-card-actions>
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
      
        <template v-slot:[`item.all`]="{ item }">
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
      ,
       selected: [],
        allSelected: false,
    }
  },
  methods: {
    getAllDataTableDtos() {
      DataTableService.getAllPublicDataTableDtos()
        .then(response => {
          this.allDataTables=response.data
          this.allDataTablesLength=this.allDataTables.length
        })
        .catch(e => console.log(e))
    }
  },
  created() {
    this.getAllDataTableDtos();
  },

  
}
</script>
