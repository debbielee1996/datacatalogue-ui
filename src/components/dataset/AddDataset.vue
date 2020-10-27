<template>
  <div>
    <v-container>
      <h2>Add New Dataset</h2>
      <ValidationObserver ref="v-form">
        <v-form>
          <ValidationProvider name="dataset name" rules="required|unique" v-slot = "{ errors }">
            <v-text-field
              v-model="datasetName"
              clearable
              filled
              clear-icon="mdi-close-circle"
              :error-messages="errors"
              label="dataset name">
            </v-text-field>
          </ValidationProvider>

          <v-text-field
            v-model="datasetDescription"
            clearable
            filled
            clear-icon="mdi-close-circle"
            label="dataset description">
          </v-text-field>
          <v-btn
            :loading="isLoading"
            class="mr-4"
            :disabled="!canCreateDataset"
            @click="submitForm"
          >
            submit
          </v-btn>
        </v-form>
      </ValidationObserver>
    </v-container>

    <v-container v-if="succuessfulCreation">
      <v-alert type="success">Successfully added dataset</v-alert>
    </v-container>
    <v-container v-if="displayErrorMessage">
      <v-alert text type="error">Error in creating new dataset</v-alert>
    </v-container>
  </div>
</template>

<script>
import DatasetService from '@/api/DatasetService'
import { extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

// Add the required rule. unique rule is done when component is mounted
extend('required', {
  ...required,
  message: '{_field_} cannot be empty',
})

export default {
  data: function() {
    return {
      datasetName: '',
      datasetDescription: '',
      outputMsg: '',
      succuessfulCreation: false,
      displayErrorMessage: false,
      loading: false,
      allDatasetDtos: []
    }
  },
  methods: {
    submitForm() {
      this.loading=true
      DatasetService.createNewDataset(this.datasetName, this.datasetDescription)
        .then(result => {
          this.loading=false
          if (result.data==true) {
            this.outputMsg='Successfully created new dataset'
            this.succuessfulCreation=true
            this.displayErrorMessage=false
            this.getAllDatasetDtos()
          } else { // most likely issue on SQL server side
            this.succuessfulCreation=false
            this.displayErrorMessage=true
          }
        })
        .catch(e => {
          this.loading=false
          this.succuessfulCreation=false
          this.displayErrorMessage=true
          console.log(e) })
    },
    getAllDatasetDtos() {
      DatasetService.getAllDatasetDtos()
        .then(response => {
          this.allDatasetDtos=response.data;
        })
        .catch(e => console.log(e))
    }
  },
  computed: {
    canCreateDataset() {
      // conditions:
      // 1. name cannot be empty
      // 2. name must be unique
      return this.datasetName.length>0 && !this.datasetExists
    },
    isLoading() {
      return this.loading
    },
    datasetExists() {
      return this.allDatasetDtos.filter(d => d.name ===this.datasetName).length >0
    }
  },
  created() {
    this.getAllDatasetDtos();
  },
  mounted() {
    extend('unique', // checks if dataset name already exists
    value => {
      if (this.allDatasetDtos.filter(d => d.name===value).length >0) {
        return 'Dataset name already exists'
      }
      return true // means valid name
    });
  }
}
</script>
