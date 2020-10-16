import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/components/general/Login.vue'
import Logout from '@/components/general/Logout.vue'
import Home from '@/components/general/Home.vue'

import AllDatasets from '@/components/dataset/AllDatasets.vue'
import AllDataTablesOfDataset from '@/components/dataset/AllDataTablesOfDataset.vue'
import AddDataset from '@/components/dataset/AddDataset.vue'

import AllDataTables from '@/components/datatable/AllDataTables.vue'
import AddDataTable from '@/components/datatable/AddDataTable.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: { layout: "no-sidebar" } // https://itnext.io/anyway-heres-how-to-create-a-multiple-layout-system-with-vue-and-vue-router-b379baa91a05
  },
  {
    path: '/loggedout',
    name: 'Logout',
    component: Logout,
    meta: { layout: "no-sidebar" } // https://itnext.io/anyway-heres-how-to-create-a-multiple-layout-system-with-vue-and-vue-router-b379baa91a05
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/alldatasets',
    name: 'AllDatasets',
    component: AllDatasets
  },
  {
    path: '/alldatatables',
    name: 'AllDataTables',
    component: AllDataTables
  },
  {
    path: '/dataset/:datasetId/alldatatables',
    name: 'AllDataTablesOfDataset',
    component: AllDataTablesOfDataset
  },
  {
    path: '/adddataset',
    name: 'AddDataset',
    component: AddDataset
  },
  {
    path: '/adddatafile',
    name: 'AddDataTable',
    component: AddDataTable
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
