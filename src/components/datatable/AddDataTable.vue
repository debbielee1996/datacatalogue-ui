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
  </div>
</template>

<script>
import DatasetService from '@/api/DatasetService'
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
      allDatasets: [],
      dataTableName: '',
      dataTableDescription: '',
      selectedDatasetId: '',
      file: null,
      succuessfulCreation: false,
      loading: false,
      fileHeaders: [],
      options: ['Text', 'Number', 'Date'],
      selectedDataTypes: []
    }
  },
  methods: {
    getAllDatasets() {
      DatasetService.getAllDatasets()
        .then(response => {
          this.allDatasets=response.data;
        })
        .catch(e => console.log(e))
    },
    submitForm() {
      console.log("selected data types "+this.selectedDataTypes)
      console.log(typeof(this.selectedDataTypes))
      this.loading=true
      DataTableService.uploadFile(this.file, this.dataTableName, this.selectedDatasetId, this.dataTableDescription, this.selectedDataTypes)
      .then(() => {
        this.loading=false
        this.succuessfulCreation=true
      })
    },
    parseFile() {
      if (this.file!=null) {
        // parse file
        this.$papa.parse(this.file, {
          header: true,
          complete: function (results) {
            this.fileHeaders = results.meta.fields; // get array of headers from csv file

            // preset selectedDataTypes to string by default
            if(this.selectedDataTypes != results.meta.fields.length) { // need this or will get trapped in infinite loop as vue will keep listening for if file!=null
              for (var i=0; i<results.meta.fields.length; i++) {
                this.selectedDataTypes[i]='Text'
              }
            }
          }.bind(this) // explicitly bind resulst.meta.fields to fileHeaders because its a looped function call [https://stackoverflow.com/questions/48336284/data-does-not-update-in-vue-js; https://medium.com/@thejasonfile/es5-functions-vs-es6-fat-arrow-functions-864033baa1a]
        });


        return true // to render whatever template content
      } else {
        console.log("no file")
        return false
      }
    }
  },
  created() {
    this.getAllDatasets();
  },
  computed: {
    canAddDataTable() {
      return this.dataTableName.length>0 && this.selectedDatasetId>0 && this.file!=null
    },
    isLoading() {
      return this.loading
    },
    fileAdded() {
      return this.parseFile()
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