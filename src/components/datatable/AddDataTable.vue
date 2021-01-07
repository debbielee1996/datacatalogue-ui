<template>
  <div>
    <v-container>
      <h2>Add New Data File</h2>
      <ValidationObserver ref="v-form">
        <v-form ref="vform">
          <v-select
            v-model="selectedDatasetId"
            @change="checkDataTableNameIsUnique()"
            :items="allDatasets"
            item-text="name"
            item-value="id"
          >
            <template slot="label">Dataset <b style="color:red">*</b></template>
          </v-select>

          <ValidationProvider name="data table name" rules="required" v-slot = "{ errors }">
            <v-text-field
              v-model="dataTableName"
              clearable
              filled
              @keyup="checkDataTableNameIsUnique()"
              clear-icon="mdi-close-circle"
              :error-messages="errors">
                <template slot="label">data table name <b style="color:red">*</b></template>
            </v-text-field>
          </ValidationProvider>
          <v-alert
            type="warning"
            v-if="!dataTableNameIsUnique"
            text
          >Data table already exists for selected dataset. If you upload you will override the existing data</v-alert>

          <ValidationProvider name="data table description" rules="required" v-slot = "{ errors }">
            <v-text-field
              v-model="dataTableDescription"
              clearable
              filled
              :error-messages="errors"
              clear-icon="mdi-close-circle">
                <template slot="label">data table description <b style="color:red">*</b></template>
            </v-text-field>
          </ValidationProvider>

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
                <th>Description</th>
              </tr>
              <tr v-for="(header, index) in fileHeaders" :key="header">
                <td
                  style="width:20%"
                >{{ header }}</td>
                <td
                  style="width:20%"
                >
                  <v-select
                    :items="options"
                    :value="header"
                    v-model="selectedDataTypes[index]"
                  />
                </td>
                <td>
                  <ValidationProvider name="column description" rules="required" v-slot = "{ errors }">
                    <v-textarea
                      solo
                      name="input-7-4"
                      rows="1"
                      clearable
                      clear-icon="mdi-close-circle"
                      :error-messages="errors"
                      v-model="dataColDescriptions[index]"
                    >
                      <template slot="label">Description <b style="color:red">*</b></template>
                    </v-textarea>
                  </ValidationProvider>
                </td>
              </tr>
            </table>
          </v-container>

          <v-btn
            color="primary"
            class="mr-4"
            :disabled="!canAddDataTable"
            :loading="isLoading"
            @click="submitForm"
          >
            submit >>
          </v-btn>
          <v-btn
            color="grey"
            class="mr-4"
            @click="resetForm"
          >
            reset
          </v-btn>
        </v-form>
      </ValidationObserver>
    </v-container>

    <v-container v-if="succuessfulCreation">
      <v-alert type="success">Successfully added data file</v-alert>
    </v-container>
    <v-container v-if="displayErrorMessage">
      <v-alert text type="error">Error in uploading data file. {{ errorMsg }}</v-alert>
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
      dataTableName: '',
      dataTableDescription: '',
      selectedDatasetId: '',
      file: null,
      succuessfulCreation: false,
      displayErrorMessage: false,
      loading: false,
      dataTableNameIsUnique: true,
      fileHeaders: [],
      options: ['Text', 'Whole number (0 decimal places)', 'Number (2 decimal places)', 'Number (5 decimal places)', 'Date'],
      selectedDataTypes: [],
      dataColDescriptions: [''],
      fileExtensions: [
        "text/comma-separated-values",
        "application/csv",
        "application/excel",
        "application/vnd.ms-excel",
        "application/vnd.msexcel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ],
      errorMsg: ''
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
    submitForm() {
      this.loading=true
      DataTableService.uploadFile(this.file, this.dataTableName, this.selectedDatasetId, this.dataTableDescription, this.selectedDataTypes, this.dataColDescriptions)
      .then(() => {
        this.loading=false
        this.succuessfulCreation=true
        this.displayErrorMessage=false
        this.errorMsg=''
      })
      .catch((e) => {
        this.loading=false
        this.succuessfulCreation=false
        this.displayErrorMessage=true
        this.errorMsg=e.response.data
      })
    },
    resetForm() {
      this.$refs.vform.reset()
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
                  this.dataColDescriptions[i]=''
                }
              }
            }.bind(this) // explicitly bind resulst.meta.fields to fileHeaders because its a looped function call [https://stackoverflow.com/questions/48336284/data-does-not-update-in-vue-js; https://medium.com/@thejasonfile/es5-functions-vs-es6-fat-arrow-functions-864033baa1a]
          });
        } else if (this.file['type'].includes("spreadsheet")) {
          // preset selectedDataTypes to string by default
          if(this.selectedDataTypes.length != this.fileHeaders.length) { // need this or will get trapped in infinite loop as vue will keep listening for if file!=null
            for (var i=0; i<this.fileHeaders.length; i++) {
              this.selectedDataTypes[i]='Text'
              this.dataColDescriptions[i]=''
            }
          }
        }
        return true // to render whatever template content
      } else {
        console.log("no file or file extension not supported")
        return false
      }
    },
    checkDataTableNameIsUnique() {
      if (this.selectedDatasetId.length!=0) {
        DataTableService.dataTableNameIsUnique(this.dataTableName, this.selectedDatasetId)
          .then(response => {
            this.dataTableNameIsUnique=response.data
            return response.data
          })
          .catch(e => {
            console.log(e)
          })
      }
    }
  },
  created() {
    this.getAllDatasetDtos()
  },
  computed: {
    canAddDataTable() {
      // conditions:
      return this.dataTableName!=null && this.dataTableName.length>0 && // 1. name cannot be null/empty
        this.selectedDatasetId>0 && // 2. must select a dataset
        this.file!=null && // 3. file must be added
        this.hasApprovedFileExtension && // 4. file must of appropriate extensions
        this.dataTableDescription!=null && this.dataTableDescription.length>0 && // 5. data table description cannot be null/empty
        !this.dataColDescriptions.includes(null) && this.dataColDescriptions.indexOf('') == -1 // 6. data col descriptions cannot be null/empty
    },
    isLoading() {
      return this.loading
    },
    fileAdded() {
      return this.parseFile()
    },
    dataTableExists() { // check if dataTable exists for given datasetId
      return this.checkDataTableNameIsUnique()
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
    width: 100%;
  }

  th, td {
    padding: 10px;
  }
</style>