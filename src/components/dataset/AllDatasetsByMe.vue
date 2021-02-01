<template>
  <v-container>
    <v-card>
      <v-card-title>
        {{ this.allDatasetsLength }} dataset(s) found
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
        <!-- edit privacy -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editPrivacyAccess(item);"
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
                <v-radio-group v-model="editedPrivacyAccess.isPublic">
                  <v-radio
                    :value=true
                    :key=true>
                    <template v-slot:label>
                      <div>
                      <p style="color:black;  margin: 0; padding: 0;font-weight: bold;">Public</p>
                      <p>Anyone can view it under 'Available Datasets'</p></div>
                    </template>
                  </v-radio>
                  <v-radio
                    :value=false
                    :key=false>
                    <template v-slot:label>
                      <div>
                      <p style="color:black;  margin: 0; padding: 0;font-weight: bold;">Private</p>
                          <p>No one can view it under 'Available Datasets'</p></div>
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
import DatasetService from '@/api/DatasetService'
export default {
  data() {
    return {
      allDatasets: [],
      search: '',
      headers: [
        {text: 'Name', value: 'name'},
        {text: 'Description', value: 'description'},
        {text: 'Created By', value: 'officerPf'},
        {text: 'Action', value: 'actions'}
      ],
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
    getAllDatasetDtos() {
      DatasetService.getDatasetsCreatedByOfficer()
        .then(response => {
          this.allDatasets=response.data
          this.allDatasetsLength=this.allDatasets.length
        })
        .catch(e => console.log(e))
    },
    editPrivacyAccess(item) {
      this.editedPrivacyAccess = Object.assign({}, item)
      this.privacyDialog=true
    },
    closePrivacyDialog () {
      this.privacyDialog = false
      this.$nextTick(() => {
        this.editedPrivacyAccess = Object.assign({}, this.defaultPrivacyAccess)
      })
    },
    savePrivacyDialog() {
       DatasetService.editDataSetPrivacy(this.editedPrivacyAccess.id, this.editedPrivacyAccess.isPublic)
        .then(() => { this.getAllDatasetDtos() })
        .catch(e => { console.log(e) })

      this.privacyDialog = false
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
