<style scoped>
.dashboard{
            width: 80%;
            min-height: 600px;
            margin: auto;}
</style>
<template>
  <div class="home">
    <v-container>
      <h1>Welcome to Data Catalogue!</h1>
      <v-btn
        elevation="2"
        outlined
        x-large
        :to="'/adddataset'"
      >Add new dataset</v-btn>

      <v-btn
        elevation="2"
        outlined
        x-large
        :to="'/adddatafile'"
      >Upload new file to dataset</v-btn>
    </v-container>
   </div>
</template>

<style scoped>
  .v-btn {
    margin-left:10px;
    margin-right:10px;
  }
</style>