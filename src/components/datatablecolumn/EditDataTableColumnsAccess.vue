<template>
  <v-container>
    <v-card>
      <v-card-title>
        Data Table: {{ dataTableColumns[0].dataTableName }}
        <v-spacer></v-spacer>  
      </v-card-title>
      <v-card-subtitle>
        Dataset: {{ dataTableColumns[0].datasetName }}
      </v-card-subtitle>
     
      <v-data-table
        :headers="getHeaders"
        :items="dataTableColumns"
        hide-default-footer
        disable-pagination
      >
      <template v-slot:[`item.privacy`]>
          <!-- <p v-for="item in privacyType">{{item}} </p> -->
          <!-- <input type="checkbox" @click="selectAll" v-model="allSelected"> -->
          <p v-for="item in privacyType" :key="item">{{item}}</p>
        </template>
       <template v-slot:[`item.all`]>
          <input type="checkbox" @click="selectAll" v-model="allSelected">
        </template>

            </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import DataTableColumnService from '@/api/DataTableColumnService'
import { extend } from 'vee-validate'
import { required } from 'vee-validate/dist/rules'

extend('required', {
  ...required,
  message: '{_field_} cannot be empty'
})

export default {
  data() {
    return {
      dataTableId: this.$route.params.dataTableId,
      dataTableColumns: [],
      selected: [],
        allSelected: false,
      headers: [
          {text: 'Privacy', value: 'privacy'},
          {text: 'All', value: 'all'}
      ],
      privacyType:['Public','Private'],
      editedItem: {
        name:'',
        description: '',
        type:''
      },
      defaultItem: {
        name:'',
        description: '',
        type:''
      }
    }
  },
  created() {
    this.getAllDataColumnDtos(this.dataTableId)
  },
  methods: {
    getAllDataColumnDtos(dataTableId) {
      DataTableColumnService.getAllDataColumnDtos(dataTableId)
        .then(response => this.dataTableColumns=response.data)
        .catch(e => console.log(e))
    },
    editItem(item) {
      this.editDialog=true
      this.editedItem = Object.assign({}, item)
    },
    close () {
      this.editDialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
    },
    save() {
      DataTableColumnService.editDataTableColumnDescription(this.editedItem.id,this.editedItem.description)
        .then(() => { this.getAllDataColumnDtos(this.dataTableId) })
        .catch(e => { console.log(e) })
      this.close()
      
      DataTableColumnService.editDataTableColumnName(this.editedItem.id,this.editedItem.name)
        .then(() => { this.getAllDataColumnDtos(this.dataTableId) })
        .catch(e => { console.log(e) })
      this.close()

    },
getHeaders(){
    console.log("hello");
         var headerList=[]
        for (var i = 0; i < this.dataTableColumns.length; i++){
            console.log("here");
            // console.log(dataTableColumns.name);
            console.log(this.dataTableColumns.name);
            var newheader={ text:+"'"+this.dataTableColumns.name+"'", value: "'"+this.dataTableColumns.name+"'"}
            headerList.append(newheader);
        }
            return headerList
        
    }

  },
  computed: {
    canEdit() {
      return this.editedItem.description.length>0
    }
  }
}
</script>