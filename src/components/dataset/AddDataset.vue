<template>
  <div>
    <v-container>
      <h2>Add New Dataset</h2>
      <ValidationObserver ref="v-form">
        <v-form ref="vform">
          <ValidationProvider name="dataset name" rules="required|unique" v-slot = "{ errors }">
            <v-text-field
              v-model="datasetName"
              clearable
              filled
              clear-icon="mdi-close-circle"
              :error-messages="errors">
                <template slot="label">dataset name <b style="color:red">*</b></template>
            </v-text-field>
          </ValidationProvider>

          <ValidationProvider name="dataset description" rules="required" v-slot= "{ errors }">
            <v-text-field
              v-model="datasetDescription"
              clearable
              filled
              :error-messages="errors"
              clear-icon="mdi-close-circle">
                <template slot="label">dataset description <b style="color:red">*</b></template>
            </v-text-field>
          </ValidationProvider>

          <AddCustodians ref="AddCustodians"></AddCustodians>

          <AddCustodianAndOwner ref="AddCustodianAndOwner"></AddCustodianAndOwner>

          <v-btn
            color="primary"
            :loading="isLoading"
            class="mr-4"
            :disabled="!canCreateDataset"
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
import AddCustodianAndOwner from '@/components/general/AddCustodianAndOwner.vue'
import AddCustodians from '@/components/general/AddCustodians.vue'


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
      datanameIsUnique: true,
      ownerPf: "",
      status: "",
      custodianPfs: []
    }
  },
  components: {
    AddCustodianAndOwner,
    AddCustodians
  },
  methods: {
    submitForm() {
      this.loading=true
      this.ownerPf = this.$refs.AddCustodianAndOwner.$data.ownerPf

      this.status = this.$refs.AddCustodianAndOwner.$data.status
      this.custodianPfs = this.$refs.AddCustodians.$data.custodianPfs

      if (this.status === "custodian") {
        this.custodianPfs.push("1001") // hardcoded custodian
      } else { // user submitting is owner
        this.ownerPf = "1001" // hardcoded for now
      }
      DatasetService.createNewDataset(this.datasetName, this.datasetDescription, this.custodianPfs, this.ownerPf)
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
    resetForm() {
      this.$refs.vform.reset()
    },
    datasetNameIsUnique() {
      const output = DatasetService.datasetNameIsUnique(this.datasetName)
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
      // 1. name cannot be null/empty
      // 2. name must be unique
      // 3. description cannot be null/empty
      // 4. owner must be declared/user declares he is owner
      return this.datasetName!=null && this.datasetName.length>0 &&
        this.datanameIsUnique==true &&
        this.datasetDescription!=null && this.datasetDescription.length>0 &&
        ((this.$refs.AddCustodianAndOwner.$data.ownerPf!=null && this.$refs.AddCustodianAndOwner.$data.ownerPf.length>0) || this.$refs.AddCustodianAndOwner.$data.status=="owner")
    },
    isLoading() {
      return this.loading
    }
  },
  mounted() {
    extend("unique", {
      validate: this.datasetNameIsUnique,
      message: "Dataset name already exists"
    })
  }
}
</script>

<style scoped>

</style>