<template>
  <v-container>
    <v-card>
      <v-card-title>
        {{ allDatasets.length }} dataset(s) found
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

        <template v-slot:[`item.officerPf`]="{ item }">
          <mark
            v-if="item.officerPf==1001"
            style="background-color:#DEFABB"
          ><b>{{ item.officerPf }}</b></mark>
        </template>
   <!-- edit item -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editPrivacyAccess(item)"
          >
           mdi-account-plus
          </v-icon>
          <!-- retain-focus to prevent maximum call stack size exceed error https://stackoverflow.com/questions/61444870/maximum-call-stack-size-exceeded-vuetify -->
        
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
<v-radio-group v-model="editedPrivacyAccess">
        <v-radio  
                  value="true"
                >
                <template v-slot:label>
                   <div>
                  <p style="color:black;  margin: 0;
    padding: 0;font-weight: bold;">Public</p>
                      <p>Everyone have access</p></div>
                </template>
                  </v-radio>
                 <v-radio
                  value="false"
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
              text>
                Cancel
              </v-btn>

              <v-btn
              color="blue darken-1"
              text>
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
import DatasetService from '@/api/DatasetService'


export default {
  data() {
    return {
      allDatasets: [],
      search: '',
      headers: [
        {text: 'Name', value: 'name'},
        {text: 'Description', value: 'description'},
        {text: 'public', value: 'isPublic'},
        {text: 'Created By', value: 'officerPf'},
        {text: 'Action', value: 'actions'}
      ],
        privacyDialog: false,
      editedPrivacyAccess: {
        isPublic:''
      },
      defaultPrivacyAccess: {
        isPublic:''
      }
    }
  },
  methods: {
    getAllDatasetDtos() {
      DatasetService.getDatasetsCreatedByOfficer()
        .then(response => {
          this.allDatasets=response.data;
        })
        .catch(e => console.log(e))
    }, 
    editPrivacyAccess(item) {
      this.editedPrivacyType = Object.assign({}, item)
      this.privacyDialog=true
    },
    closePrivacyDialog () {
      this.privacyDialog = false
      this.$nextTick(() => {
        this.editedPrivacyAccess = Object.assign({}, this.defaultPrivacyAccess)
      })
    },
    savePrivacyDialog() {
      // DataTableService.editDataTableDescription(this.editedItem.id, this.editedItem.description)
      //   .then(() => { this.getAllDataTableDtos() })
      //   .catch(e => { console.log(e) })
      // this.close()
    }

  },
  created() {
    this.getAllDatasetDtos();
  },
   
     computed: {
    canEdit() {
      return this.editedPrivacyType.isPublic.length>0
    }}

}
</script>
