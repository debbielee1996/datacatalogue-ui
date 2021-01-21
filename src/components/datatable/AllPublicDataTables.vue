<template>
  <v-container>
    <v-card>
      <v-card-title>
        {{ allPublicDataTables.length }} data table(s) found
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
        ></v-text-field>
      </v-card-title>
      <!-- show public datatable. allPublicDataTables is computed -->
      <v-data-table
        :headers="headers"
        :items="allPublicDataTables"
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

        <template v-slot:[`item.actions`]="{ item }">
          
          <a :href="'/datatable/'+item.id+'/allpubliccolumns'">
            view
          </a>
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
        {text: 'Dataset Name', value: 'datasetName'},
        {text: 'Dataset Description', value: 'datasetDescription'},
        {text: 'DataTable', value: 'name'},
        {text: 'DataTable Description', value: 'description'},
        {text: 'Created By', value: 'officerPf'},
        {text: 'Action', value: 'actions'}
      ],
    }
  },
  methods: {
    getAllDataTableDtos() {
      DataTableService.getAllPublicDataTableDtos()
        .then(response => {
          this.allDataTables=response.data;
        })
        .catch(e => console.log(e))
    },
  },
  created() {
    this.getAllDataTableDtos();
  },
  
   // filter to show datatable that is public in table
   computed: {
    allPublicDataTables() {
      return this.allDataTables.filter(d => {
        return (d.isPublic==true);
      })
    }
  },
}
</script>