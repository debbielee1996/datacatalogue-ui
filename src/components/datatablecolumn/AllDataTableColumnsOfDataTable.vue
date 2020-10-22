<template>
  <v-container>
    <v-card>
      <v-card-title>
        Data Columns
        <v-spacer></v-spacer>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="dataTableColumns"
      >
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import DataTableColumnService from '@/api/DataTableColumnService'

export default {
  data() {
    return {
      dataTableId: this.$route.params.dataTableId,
      dataTableColumns: [],
      headers: [
        {text: 'Name', value: 'name'},
        {text: 'Type', value: 'type'},
        {text: 'Description', value: 'description'},
        {text: 'DataTable Name', value: 'dataTableName'}
      ]
    }
  },
  created() {
    this.getAllDataColumnDtos(this.dataTableId)
  },
  methods: {
    getAllDataColumnDtos(dataTableId) {
      DataTableColumnService.getAllDataColumnDtos(dataTableId)
        .then(response => this.dataTableColumns=response.data)
        .catch(e => console.log(e))
    }
  }
}
</script>