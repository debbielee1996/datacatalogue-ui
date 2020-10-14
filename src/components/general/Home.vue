<template>
  <div class="home">
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

  </div>
</template>

<style scoped>
  .v-btn {
    margin-left:10px;
    margin-right:10px;
  }
</style>