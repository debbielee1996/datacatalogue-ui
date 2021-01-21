<style>
/* css of table */
tr:hover {background-color:#f5f5f5;}
</style>
<script src="https://cdn.jsdelivr.net/vue/latest/vue.js"></script>
<template>
  <div>
    <v-container>
      <v-card>
        <v-card-title>
          Data Table: {{ dataTableColumns[0].dataTableName }}
          <v-spacer></v-spacer>  
        </v-card-title>
        <v-card-subtitle>
          Dataset: {{ dataTableColumns[0].datasetName }}
        </v-card-subtitle>
        <div class="v-data-table theme--light" >   
          <div class="v-data-table__wrapper" >
            <table>
              <!-- calling the method so that there is data in header -->
              <p style="display:none;">  
                {{getHeader()}}
                {{getDatas()}}
                {{getColumnId()}}
              </p>           
                
              <tr  class="text-start sortable" role="columnheader">
                <th class="v-data-table-header" v-for="(r,i) in header"  :key="i">
                  <span>{{r.text}}</span>
                </th>
              </tr>
              <!-- ITEMS -->
              <!-- this for loop is to show the privacy column value. It will have 2 row which will be "public" and "private" -->
              <tr v-for="(j, l) in editedPrivacy" :key="l">
                <td style="text-align:center;border-bottom: 1px solid #ddd;padding:5px;">{{j.Privacy}}</td>
                
                  <!-- Checkboxes to check all. -->
                  <!-- <td class="text-start"> -->
                  <!-- <input type="checkbox"  v-model="j.selectAll" @change="SelectAll(j.Privacy);"> -->
                  <!-- <input type="checkbox"  v-model="j.selectAll" > -->
                  <!-- </td> -->
                <!-- checkboxes in each column of each row  -->
                <td v-for="(f, g) in columnId" :key="g"  style="text-align:center;border-bottom: 1px solid #ddd;padding:5px;" >
                  <input type="checkbox" v-model="j[f]" :value="j.Privacy+f" >
                </td>     
              </tr>
            </table>
          </div>
        </div>
      </v-card>
      <v-card-actions>
      <v-spacer></v-spacer>
        <!-- button to go back to the page -->
        <v-btn
          color="blue darken-1"
          text   
        >
          <a style="text-decoration: none;" :href="'/datatable/'+ dataTableColumns[0].dataTableId+'/allcolumns'">Back</a>  
        </v-btn>
        <!-- save button -->
        <v-btn
          color="blue darken-1"
          text
          @click="save"
        >
          Save
        </v-btn>
      </v-card-actions>    
    </v-container>
    <!-- <v-container v-if="succuessfulCreation">
      <v-alert type="success">Successfully saved.</v-alert>
    </v-container> -->
    <!-- display error message -->
    <v-container v-if="displayErrorMessage">
      <v-alert text type="error">Error in saving. {{ errorMsg }}</v-alert>
    </v-container>
  </div>
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
      result:[],
      displayErrorMessage: false,
      succuessfulCreation: false,
      errorMsg: '',
      run1TimeForgetHeader:0,
      run1TimeForgetDatas:0,
      run1TimeForgetColumnId:0,
      columnId:[],
      editedPrivacy: [{Privacy:"Public",selectAll:false,selected:[]},{Privacy:"Private",selectAll:false,selected:[]}],
      defaultPrivacy:[{Privacy:"Public"},{Privacy:"Private"}],
      header:[{text:"Privacy",value:"Privacy"}],
      dataTableId: this.$route.params.dataTableId,
      dataTableColumns: [],
      selected: [],
      allSelected: false,
    }
  },
  created() {
    this.getAllDataColumnDtos(this.dataTableId);
  },
  methods: {
    getAllDataColumnDtos(dataTableId) {
      DataTableColumnService.getAllDataColumnDtos(dataTableId)
        .then(response => this.dataTableColumns=response.data)
        .catch(e => console.log(e))
    },
    // check if there is any error when saving
    check(){
      var numofPublic=[];
      var numofPrivate=[];
      for(var i=0; i<this.editedPrivacy.length;i++){
        for(var j=0;j<this.columnId.length;j++){
          if (this.editedPrivacy[i].Privacy=="Public"){
            // check if the checkbox of Public row the column is checked. If checked push 1 into list if not push 0
            if(this.editedPrivacy[i][this.columnId[j]]==true){
              numofPublic.push(1); 
            }
            else{
              numofPublic.push(0); 
            }
          }
          else{
            // check if the checkbox of Private row the column is checked. If checked push 1 into list if not push 0
            if(this.editedPrivacy[i][this.columnId[j]]==true){
              numofPrivate.push(1);
            }
            else{
              numofPrivate.push(0);
            }
          } 
        }
      }
      for(var k=0;k<numofPublic.length;k++){
        // check if checkbox of each column is only tick ones either on row Public or Private and not both or none.
        if(numofPublic[k]+numofPrivate[k]==2){
          this.displayErrorMessage=true;
          return this.errorMsg="Please make sure to check each coloumn only once."
        }else{
          if(numofPublic[k]+numofPrivate[k]==0){
            this.displayErrorMessage=true;
            return this.errorMsg="Please choose the privacy for each coloumn"
          }else{
            if(numofPublic[k]+numofPrivate[k]==1){
              this.displayErrorMessage=false
            }
          }
        }
      }
    },    
    getColumnId(){
       // puting this run1TimeForgetColumnId making it run 1 time to get columnId  data.
      if(this.run1TimeForgetColumnId==0){
        for (var j = 0; j < this.dataTableColumns.length; j++){
          this.columnId.push(this.dataTableColumns[j].id);
        }
        this.run1TimeForgetColumnId+=1;
        return this.columnId
      }
      else{
        return this.columnId
      }
    },
    getDatas(){
    // puting this run1TimeForgetData make the method run 1 time to get editedPrivacy and defaultPrivacy.
    if(this.run1TimeForgetDatas==0){
      var numOfPublicColumn=0;
      var numOfPrivateColumn=0;
      for(var i=0;i<this.editedPrivacy.length;i++){
        for (var j = 0; j < this.dataTableColumns.length; j++){
          var privacytype=this.dataTableColumns[j].isPublic
          if(this.editedPrivacy[i].Privacy=="Public"){
            if(privacytype==true){
              this.editedPrivacy[i].selected.push(this.editedPrivacy[i].Privacy+this.dataTableColumns[j].id);
            }
            this.editedPrivacy[i][this.dataTableColumns[j].id]=privacytype;
          }else{
          // making the private data of each column to be opposite of the public data
            if(privacytype==false){
              this.editedPrivacy[i].selected.push(this.editedPrivacy[i].Privacy+this.dataTableColumns[j].id);
            }
            this.editedPrivacy[i][this.dataTableColumns[j].id]=!privacytype;
          }
        }
      }
      for(var k=0;k<this.defaultPrivacy.length;k++){
        for (var u = 0; u < this.dataTableColumns.length; u++){
          var privacytypee=this.dataTableColumns[u].isPublic
          if(this.defaultPrivacy[k].Privacy=="Public"){
            this.defaultPrivacy[k][this.dataTableColumns[u].id]=privacytypee;
          }else{
            // making the private data of each column to be opposite of the public data
            this.defaultPrivacy[k][this.dataTableColumns[u].id]=!privacytypee
          }
        }
      }
      this.run1TimeForgetDatas+=1
       return this.editedPrivacy
      }else{
        return this.editedPrivacy
      }
    },
    // purpose is to show the title/header of the table. The header contain the "Privacy" and column names
    getHeader(){
    // puting this run1TimeForgetHeader run 1 time to get header data.
      if(this.run1TimeForgetHeader==0){
        for (var i = 0; i < this.dataTableColumns.length; i++){
          var newheader={text:this.dataTableColumns[i].name,value:this.dataTableColumns[i].id};
          this.header.push(newheader);
        }
        this.run1forgetHeader+=1;
        return this.header  
      }else{
        return this.header 
      }
    },

    save() {
      // checking
      this.check();
      if(this.displayErrorMessage==false){
        for (var j=0;j<this.dataTableColumns.length;j++){
          var value = this.editedPrivacy[0][j+1];
          this.result.push([j+1,value]);
        }
        DataTableColumnService.editDataTableColumnPrivacy(this.result)
          .then(() => { this.getAllDataColumnDtos(this.dataTableId) })
          .catch(e => { console.log(e) })
      }
    },
    SelectAll(Privacy){
      console.log("select all function ");
      if(Privacy=="Public"){
// var checkboxes=Document.getElementsByClassName(Privacy);
//   for (var p = 0; p < checkboxes.length; p++) {
//     checkboxes[p].checked = checked;
//     console.log("seeign if checkbox is checked");
//   }
        console.log("public");
        for(var i=0; i<this.columnId.length;i++){
     
          this.editedPrivacy[0][this.columnId[i]]=true;
          this.editedPrivacy[1][this.columnId[i]]=false;
          this.editedPrivacy[1].selectAll=false;
          console.log("now+ "+this.editedPrivacy[0])
          }
          }else{
            console.log("Private");
          for(var k=0; k<this.columnId.length;k++){
           this.editedPrivacy[1][this.columnId[k]]=true;
            this.editedPrivacy[0][this.columnId[i]]=false;
          this.editedPrivacy[0].selectAll=false;
          }}
    },
    Select(){
      for(var i=0;i<this.editedPrivacy.length;i++){
        this.editedPrivacy[i].selectAll=false;
      }
    },
  
  },
  computed: {
    canEdit() {
      return this.editedItem.description.length>0
    }
  }
}
</script>