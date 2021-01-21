<template>
  <div>
    <v-autocomplete
        v-model="custodianPfs"
        :items="items"
        item-text="name"
        item-value="pf"
        label="Add Custodians (Optional)"
        placeholder="Start typing to search..."
        hide-no-data
        chips
        deletable-chips
        multiple
        :loading="loading"
        :filter="customFilter"
        :search-input.sync="search"
      >
        <template slot="item" slot-scope="data">
          {{ data.item.name }} [{{ data.item.pf }}]
        </template>
      </v-autocomplete>
  </div>
</template>

<script>
import OfficerService from '@/api/OfficerService.js'

export default {
  data() {
    return {
      custodianPfs: [],
      officerList: [],
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