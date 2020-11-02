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
        hide-default-footer
        disable-pagination
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>

          <v-dialog
            :retain-focus="false"
            v-model="editDialog"
            max-width="500px"
          >
            <v-card>
              <v-card-title>
                <span class="headline">Edit DataTableColumn</span>
                </v-card-title>

              <v-container>
                <v-text-field
                  v-model="editedItem.description"
                  label="Description"
                ></v-text-field>
              </v-container>

              <!-- save/cancel buttons -->
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
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
        {text: 'DataTable Name', value: 'dataTableName'},
        {text: 'Actions', value: 'actions'}
      ],
      editDialog: false,
      editedItem: {
        description: ''
      },
      defaultItem: {
        description: ''
      }
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
    },
    editItem(item) {
      this.editDialog=true
      this.editedItem = Object.assign({}, item)
    },
    close () {
      this.editDialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
    },
    save() {
      DataTableColumnService.editDataTableColumnDescription(this.editedItem.id, this.editedItem.description)
        .then(() => { this.getAllDataColumnDtos(this.dataTableId) })
        .catch(e => { console.log(e) })
      this.close()
    }
  }
}
</script>