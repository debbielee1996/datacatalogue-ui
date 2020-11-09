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
      datanameIsUnique: true
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
    datasetNameExists() {
      const output = DatasetService.datasetNameExists(this.datasetName)
        .then(response => {
          this.datanameIsUnique=response.data
          return response.data
      })
      return output
    }
  },
  computed: {
    canCreateDataset() {
      // conditions:
      // 1. name cannot be empty
      // 2. name must be unique
      return this.datasetName.length>0 && this.datanameIsUnique==true
    },
    isLoading() {
      return this.loading
    }
  },
  mounted() {
    extend("unique", {
      validate: this.datasetNameExists,
      message: "Dataset name already exists"
    })
  }
}
</script>
