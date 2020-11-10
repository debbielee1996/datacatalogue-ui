<template>
  <v-container>
    <v-card>
      <v-card-title>
        Data Tables Owned
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
        :items="allDataTables"
        :search="search"
      >
        <template v-slot:[`item.name`]="{ item }">
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

        <!-- edit item -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <!-- retain-focus to prevent maximum call stack size exceed error https://stackoverflow.com/questions/61444870/maximum-call-stack-size-exceeded-vuetify -->
          <v-dialog
            :retain-focus="false"
            v-model="editDialog"
            max-width="500px"
          >
            <v-card>
              <v-card-title>
                <span class="headline">Edit DataTable Details</span>
              </v-card-title>

              <v-container>
                <v-text-field
                  v-model="editedItem.description"
                  label="Description"
                >
                </v-text-field>
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
        {text: 'Dataset Name', value: 'datasetName'},
        {text: 'Action', value: 'actions'}
      ],
      editDialog: false,
      editedItem: {
        description:''
      },
      defaultItem: {
        description:''
      }
    }
  },
  methods: {
    getAllDataTableDtos() {
      DataTableService.getDataTablesCreatedByOfficer()
        .then(response => {
          this.allDataTables=response.data;
        })
        .catch(e => console.log(e))
    },
    editItem(item) {
      this.editedItem = Object.assign({}, item)
      this.editDialog=true
    },
    close () {
      this.editDialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
    },
    save() {
      DataTableService.editDataTableDescription(this.editedItem.id, this.editedItem.description)
        .then(() => { this.getAllDataTableDtos() })
        .catch(e => { console.log(e) })
      this.close()
    }
  },
  created() {
    this.getAllDataTableDtos();
  }
}
</script>