<template>
  <v-container>
    <v-card>
      <v-card-title>
        Data Table: {{ dataTableColumns[0].dataTableName }}
        <v-spacer></v-spacer>  
        
        <v-card-actions>
          <v-btn color="blue darken-1">
            <a style="text-decoration: none; color:white;" :href="'/allpublicdatatables'">Back</a>
          </v-btn>
        </v-card-actions>
      </v-card-title>
      <v-card-subtitle>
        Dataset: {{ dataTableColumns[0].datasetName }}
      </v-card-subtitle>
     
      <v-data-table
        :headers="headers"
        :items="dataTableColumns"
        hide-default-footer
        disable-pagination
      >
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import DataTableColumnService from '@/api/DataTableColumnService'
import { extend } from 'vee-validate'
import { required } from 'vee-validate/dist/rules'

extend('required', {
  ...required,
  message: '{_field_} cannot be empty'
})

export default {
  data() {
    return {
      dataTableId: this.$route.params.dataTableId,
      dataTableColumns: [],
      headers: [
        {text: 'Name', value: 'name'},
        {text: 'Type', value: 'type'},
        {text: 'Description', value: 'description'},
      ],
    }
  },
  created() {
    this.getAllDataColumnDtos(this.dataTableId)
  },
  methods: {
    getAllDataColumnDtos(dataTableId) {
      DataTableColumnService.getAllPublicDataColumnDtos(dataTableId)
        .then(response => this.dataTableColumns=response.data)
        .catch(e => console.log(e))
    },

  },
}
</script>