<template>
  <v-app>
    <!-- Top app bar -->
    <v-app-bar color="primary" dark fixed app clipped-left clipped-right>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer">
      </v-app-bar-nav-icon>
      <v-toolbar-title>Data Catalogue</v-toolbar-title>
      <v-spacer></v-spacer>

      Welcome, hardcoded-user!
    </v-app-bar>

    <!-- Navigation bar -->
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
      clipped>
      <v-list nav dense rounded>
        <v-list-item two-line>
            <v-list-item-icon>
              <v-icon>{{ profile.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ profile.title }}</v-list-item-title>
              <v-list-item-subtitle>PN: hardcoded</v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item :to="home.action">
            <v-list-item-icon>
              <v-icon>{{ home.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ home.title }}</v-list-item-title>
        </v-list-item>

        <v-list-item :to="adddataset.action">
            <v-list-item-icon>
              <v-icon>{{ adddataset.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ adddataset.title }}</v-list-item-title>
        </v-list-item>

        <v-list-item :to="adddatatable.action">
            <v-list-item-icon>
              <v-icon>{{ adddatatable.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ adddatatable.title }}</v-list-item-title>
        </v-list-item>

        <v-list-item :to="alldatasets.action">
            <v-list-item-icon>
              <v-icon>{{ alldatasets.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ alldatasets.title }}</v-list-item-title>
        </v-list-item>

        <v-list-item :to="alldatatables.action">
            <v-list-item-icon>
              <v-icon>{{ alldatatables.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ alldatatables.title }}</v-list-item-title>
        </v-list-item>

        <v-list-item :to="logout.action">
            <v-list-item-icon>
              <v-icon>{{ logout.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ logout.title }}</v-list-item-title>
        </v-list-item>

      </v-list>
    </v-navigation-drawer>

    <!-- content from whichever router -->
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    name: 'DefaultLayout',
    data: () => ({
      drawer: null,
      profile: {
        icon: "mdi-account",
        title: "Profile"
      },
      home: {
        icon: "mdi-home",
        title: "Home",
        action: "/home"
      },
      adddataset: {
        icon: "mdi-new-box",
        title: "New Dataset",
        action: "/adddataset"
      },
      alldatasets: {
        icon: "mdi-file-document",
        title: "All datasets",
        action: "/alldatasets"
      },
      adddatatable: {
        icon: "mdi-new-box",
        title: "New Data File",
        action: "/adddatafile"
      },
      alldatatables: {
        icon: "mdi-file-table",
        title: "All datatables",
        action: "/alldatatables"
      },
      logout: {
        icon: "mdi-logout",
        title: "Logout",
        action: "/"
      }
    })
  }
</script>
