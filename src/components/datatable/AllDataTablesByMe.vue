<template>
  <v-container>
    <v-card>
      <v-card-title>
        {{ this.allDataTablesLength }} data table(s) found
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
          >
            <b>{{ item.officerPf }}</b>
          </mark>
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
                <span class="headline">Edit {{ editedItem.name }}</span>
              </v-card-title>

              <v-container>
                <ValidationProvider name="description" rules="required" v-slot= "{ errors }">
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

  <!-- icon to edit privacy -->
          <v-icon
            small
            class="mr-2"
            @click="editPrivacyAccess(item)"
          >
            mdi-account-plus
          </v-icon>

        <!-- dialog for setting privacy -->
          <v-dialog
            :retain-focus="false"
            v-model="privacyDialog"
            max-width="500px"
          >
            <v-card>
              <v-card-title>
                <span class="headline">Privacy Setting </span>
              </v-card-title>
              <v-container>  
                <v-radio-group v-model="editedPrivacyAccess.isPublic">
                  <v-radio  
                    :value=true
                    :key=true
                  >
                    <template v-slot:label>
                      <div>
                        <p style="color:black;  margin: 0;
                        padding: 0;font-weight: bold;">Public</p>
                        <p>Everyone have access</p></div>
                    </template>
                  </v-radio>
                  <v-radio
                    :value=false
                    :key=false
                  >
                    <template v-slot:label>
                      <div>
                        <p style="color:black;  margin: 0;
                        padding: 0;font-weight: bold;">Private</p>
                        <p>Only data owner/custodians have access</p></div>
                    </template>
                  </v-radio>
                </v-radio-group>
              </v-container>

              <!-- save/cancel buttons -->
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="closePrivacyDialog"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="savePrivacyDialog"
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
import { extend } from 'vee-validate'
import { required } from 'vee-validate/dist/rules'

extend('required', {
  ...required,
  message: '{_field_} cannot be empty'
})

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
        description:'',
      },
      defaultItem: {
        description:'',
      },
       privacyDialog: false,
      editedPrivacyAccess: {
        isPublic:null
      },
      defaultPrivacyAccess: {
        isPublic:null
      }
    }
  },
  methods: {
    getAllDataTableDtos() {
      DataTableService.getDataTablesCreatedByOfficer()
        .then(response => {
          this.allDataTables=response.data
          this.allDataTablesLength=this.allDataTables.length
        })
        .catch(e => console.log(e))
    },
    editPrivacyAccess(item){
this.editedPrivacyAccess = Object.assign({}, item)
      this.privacyDialog=true
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
    },
     closePrivacyDialog () {
      this.privacyDialog = false
      this.$nextTick(() => {
        this.editedPrivacyAccess = Object.assign({}, this.defaultPrivacyAccess)
      })
    },
    savePrivacyDialog() {
      DataTableService.editDataTablePrivacy(this.editedPrivacyAccess.id, this.editedPrivacyAccess.isPublic)
        .then(() => { this.getAllDataTableDtos() })
        .catch(e => { console.log(e) })
     
       
      this.privacyDialog = false
    }
  },
  created() {
    this.getAllDataTableDtos();
  },
  computed: {
    canEdit() {
      return this.editedItem.description.length>0
    },
  }
}
</script>
