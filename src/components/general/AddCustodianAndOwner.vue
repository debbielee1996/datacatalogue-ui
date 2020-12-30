<template>
  <div>
    <h4>Status declaration</h4>
    <div class="custom-control custom-radio">
      <input v-model="status" value="owner" type="radio" class="custom-control-input" id="owner" name="ownerCustodianSelect">
      <label class="custom-control-label" for="owner">I am the dataset owner.</label>
    </div>

    <div class="custom-control custom-radio">
      <input v-model="status" value="custodian" type="radio" class="custom-control-input" id="custodian" name="ownerCustodianSelect">
      <label class="custom-control-label" for="custodian">I am the dataset custodian.</label>
    </div>
    <br>
    <div v-if="status === 'custodian'" > <!-- search box for custodian to input owner -->
      <v-autocomplete
        v-model="ownerPf"
        :items="items"
        item-text="name"
        item-value="pf"
        :loading="loading"
        :search-input.sync="search"
        placeholder="Start typing to search..."
        hide-no-data
        filled
        :filter="customFilter"
        @change="selected"
      >
        <template slot="item" slot-scope="data">
          {{ data.item.name }} [{{ data.item.pf }}]
        </template>
        <template slot="label">Select data owner <b style="color:red">*</b></template>
      </v-autocomplete>
    </div>
  </div>
</template>

<script>
import OfficerService from '@/api/OfficerService.js'

export default {
  data() {
    return {
      status: "custodian",
      ownerPf: "",
      custodianPf: "",
      custodianPfs: [],
      officerList: [], // list of all officers from api
      loading: false,
      search: null
    }
  },
  watch: {
    search() {
      // officerList already loaded
      if (this.officerList > 0 ) return

      // officerList already been requested
      if (this.loading) return

      // lazily load officerList
      this.loading = true

      return OfficerService.getAllOfficersDto()
      .then(response => {
        this.officerList = response.data
      })
      .finally(this.loading = false)
    }

  },
  methods: {
    customFilter(item, queryText) {
      const textOne = item.name.toLowerCase()
      const textTwo = item.pf.toLowerCase()
      const searchText = queryText.toLowerCase()
      return (textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1)
    },
    selected() {
      this.$emit('selected', this.ownerPf)
    }
  },
  computed: {
    items() {
      return this.officerList.map(officer => {
        return Object.assign(
          {},
          {
            pf: officer.pf,
            name: officer.name
          }
        )
      })
    }
  }
}
</script>