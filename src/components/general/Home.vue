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
    tableau desktop and it is published to tableau online
    <iframe src="https://prod-apnortheast-a.online.tableau.com/t/datacatalog/views/tableaudesktoptesting/Tableaudesktopdashboard?:embed=yes&:tabs=yes&:toolbar=yes" class="dashboard"></iframe>
  
     <iframe src="https://prod-apnortheast-a.online.tableau.com/t/datacatalog/views/tableaudesktoptestingdata/Dashboard2?:embed=yes&:tabs=yes&:toolbar=yes" class="dashboard">
    </iframe>
    tableau online
   
    <iframe src="https://prod-apnortheast-a.online.tableau.com/t/datacatalog/views/testing/Dashboard1?:embed=yes&:tabs=yes&:toolbar=yes" class="dashboard">
    </iframe>
    
    tableau public
    <iframe src="https://public.tableau.com/views/Singaporeregionfortestinghavesomewrongvalue/SingaporeRegion?:language=en&:display_count=y&:origin=viz_share_link" class="dashboard"></iframe>
  </div>
</template>

<style scoped>
  .v-btn {
    margin-left:10px;
    margin-right:10px;
  }
</style>