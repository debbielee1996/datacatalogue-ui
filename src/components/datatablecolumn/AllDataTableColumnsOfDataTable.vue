<template>
  <v-container>
    <v-card>
      <v-card-title>
        Data Table: {{ dataTableColumns[0].dataTableName }}
        <v-spacer></v-spacer>  
        
        <v-card-actions>
         <!-- button to go to editdatatablecolumnsaccess page -->
         <v-btn color="blue darken-1">
         <a style="text-decoration: none; color:white;" :href="'/datatable/'+ dataTableColumns[0].dataTableId+'/SetPermissionallcolumns'">Set Permission</a></v-btn>
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
            overlay-opacity="0.2"
          >
            <v-card>
              <v-card-title>
                <span class="headline">Edit {{ editedItem.name }}</span>
              </v-card-title>

              <v-container>
                <ValidationProvider name="description" rules="required" v-slot = "{ errors }">
                  <v-text-field
                    v-model="editedItem.description"
                    :error-messages="errors"
                  >
                    <template v-slot:label>Description <b style="color:red">*</b></template>
                  </v-text-field>
                </ValidationProvider>
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
                  :disabled="!canEdit"
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
      DataTableColumnService.editDataTableColumnDescription(this.editedItem.id,this.editedItem.description)
        .then(() => { this.getAllDataColumnDtos(this.dataTableId) })
        .catch(e => { console.log(e) })
      this.close()
    }
  },
  computed: {
    canEdit() {
      return this.editedItem.description.length>0
    }
  }
}
</script>