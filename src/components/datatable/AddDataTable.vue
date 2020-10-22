<template>
  <div>
    <v-container>
      <h2>Add New Data File</h2>
      <ValidationObserver ref="v-form">
        <v-form>
          <v-select
            v-model="selectedDatasetId"
            :items="allDatasets"
            item-text="name"
            item-value="id"
            label="Dataset"
          >
          </v-select>

          <ValidationProvider name="data table name" rules="required" v-slot = "{ errors }">
            <v-text-field
              v-model="dataTableName"
              clearable
              filled
              clear-icon="mdi-close-circle"
              :error-messages="errors"
              label="data table name">
            </v-text-field>
          </ValidationProvider>
          <v-alert
            type="warning"
            v-if="dataTableExists"
            text
          >Data table already exists for selected dataset. If you upload you will override the existing data</v-alert>

          <v-text-field
            v-model="dataTableDescription"
            clearable
            filled
            clear-icon="mdi-close-circle"
            label="data table description">
          </v-text-field>

          <ValidationProvider name="file" rules="required" v-slot = "{ errors }">
            <v-file-input
              v-model="file"
              show-size
              :error-messages="errors"
              label="Select file"
            >
            </v-file-input>
          </ValidationProvider>

          <!-- allow data owners to select the data types for each column. default is text -->
          <v-container v-if="fileAdded">
            <table>
              <tr>
                <th>Column Name</th>
                <th>Data Type</th>
              </tr>
              <tr v-for="(header, index) in fileHeaders" :key="header">
                <td>{{ header }}</td>
                <td>
                  <v-select
                    :items="options"
                    :value="header"
                    v-model="selectedDataTypes[index]"
                  />
                </td>
              </tr>
            </table>
          </v-container>

          <v-btn
            class="mr-4"
            :disabled="!canAddDataTable"
            :loading="isLoading"
            @click="submitForm"
          >
            submit
          </v-btn>
        </v-form>
      </ValidationObserver>
    </v-container>

    <v-container v-if="succuessfulCreation">
      <v-alert type="success">Successfully added data file</v-alert>
    </v-container>
    <v-container v-if="displayErrorMessage">
      <v-alert text type="error">Error in uploading data file</v-alert>
    </v-container>
  </div>
</template>

<script>
import DatasetService from '@/api/DatasetService'
import DataTableService from '@/api/DataTableService'
import { extend } from 'vee-validate'
import { required } from 'vee-validate/dist/rules'
import readXlsxFile from 'read-excel-file'

extend('required', {
  ...required,
  message: '{_field_} cannot be empty'
})

export default {
  data() {
    return {
      allDatasets: [],
      allDataTableDtos: [],
      dataTableName: '',
      dataTableDescription: '',
      selectedDatasetId: '',
      file: null,
      succuessfulCreation: false,
      displayErrorMessage: false,
      loading: false,
      fileHeaders: [],
      options: ['Text', 'Number', 'Date'],
      selectedDataTypes: [],
      fileExtensions: [
        "text/comma-separated-values",
        "application/csv",
        "application/excel",
        "application/vnd.ms-excel",
        "application/vnd.msexcel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ]
    }
  },
  methods: {
    getAllDatasetDtos() {
      DatasetService.getAllDatasetDtos()
        .then(response => {
          this.allDatasets=response.data;
        })
        .catch(e => console.log(e))
    },
    getAllDataTableDtos() {
      DataTableService.getAllDataTableDtos()
        .then(response => {
          this.allDataTableDtos=response.data;
        })
        .catch(e => console.log(e))
    },
    submitForm() {
      this.loading=true
      DataTableService.uploadFile(this.file, this.dataTableName, this.selectedDatasetId, this.dataTableDescription, this.selectedDataTypes)
      .then(() => {
        this.loading=false
        this.succuessfulCreation=true
        this.displayErrorMessage=false
        this.getAllDataTableDtos()
      })
      .catch((e) => {
        this.loading=false
        this.succuessfulCreation=false
        this.displayErrorMessage=true
        console.log(e)
      })
    },
    parseFile() {
      if (this.file!=null && this.hasApprovedFileExtension) {
        // parse file
        if (this.file['type'].includes("csv") || this.file['type'].includes("excel")) {
            this.$papa.parse(this.file, {
            header: true,
            complete: function (results) {
              this.fileHeaders = results.meta.fields; // get array of headers from csv file

              // preset selectedDataTypes to string by default
              if(this.selectedDataTypes.length != results.meta.fields.length) { // need this or will get trapped in infinite loop as vue will keep listening for if file!=null
                for (var i=0; i<this.fileHeaders.length; i++) {
                  this.selectedDataTypes[i]='Text'
                }
              }
            }.bind(this) // explicitly bind resulst.meta.fields to fileHeaders because its a looped function call [https://stackoverflow.com/questions/48336284/data-does-not-update-in-vue-js; https://medium.com/@thejasonfile/es5-functions-vs-es6-fat-arrow-functions-864033baa1a]
          });
        } else if (this.file['type'].includes("spreadsheet")) {
          // preset selectedDataTypes to string by default
          if(this.selectedDataTypes.length != this.fileHeaders.length) { // need this or will get trapped in infinite loop as vue will keep listening for if file!=null
            for (var i=0; i<this.fileHeaders.length; i++) {
              this.selectedDataTypes[i]='Text'
            }
          }
        }
        return true // to render whatever template content
      } else {
        console.log("no file or file extension not supported")
        return false
      }
    }
  },
  created() {
    this.getAllDatasetDtos();
    this.getAllDataTableDtos();
  },
  computed: {
    canAddDataTable() {
      // conditions:
      // 1. name cannot be empty
      // 2. must select a dataset
      // 3. file must be added
      return this.dataTableName != null && this.dataTableName.length>0 && this.selectedDatasetId>0 && this.file!=null && this.hasApprovedFileExtension
    },
    isLoading() {
      return this.loading
    },
    fileAdded() {
      return this.parseFile()
    },
    dataTableExists() { // check if dataTable exists for given datasetId
      return this.allDataTableDtos.filter(dt => dt.datasetId===this.selectedDatasetId && dt.name===this.dataTableName).length>0
    },
    hasApprovedFileExtension() {
      if (this.file!=null) {
        return this.fileExtensions.includes(this.file['type'])
      }
      return false
    }
  },
  watch: {
    file: function() { // look for change in files
      // reset
      this.fileHeaders=[]
      this.selectedDataTypes=[]

      // for .xlsx files parse it
      if (this.file['type'].includes("spreadsheet")) {
        readXlsxFile(this.file)
          .then((response) => { this.fileHeaders=response[0] })
          .catch(e => console.log(e))
      }
    }
  }
}
</script>

<style scoped>
  table {
    display: table;
    width: 50%;
  }
</style>