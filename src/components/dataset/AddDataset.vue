<template>
  <div>
    <v-container>
      <h2>Add New Dataset</h2>
      <ValidationObserver ref="v-form">
        <v-form>
          <ValidationProvider name="dataset name" rules="required" v-slot = "{ errors }">
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
  </div>
</template>

<script>
import DatasetService from '@/api/DatasetService'
import { extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

// Add the required rule
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
      loading: false
    }
  },
  methods: {
    submitForm() {
      this.loading=true
      DatasetService.createNewDataset(this.datasetName, this.datasetDescription)
        .then(() => {
          this.outputMsg='Successfully created new dataset'
          this.succuessfulCreation=true
          this.loading=false
        })
        .catch(e => console.log(e))
    }
  },
  computed: {
    canCreateDataset() {
      return this.datasetName.length>0
    },
    isLoading() {
      return this.loading
    }
  }
}
</script>
