import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/general/Home.vue'

import AllDatasets from '@/components/dataset/AllDatasets.vue'
import AllDataTablesOfDataset from '@/components/dataset/AllDataTablesOfDataset.vue'
import AddDataset from '@/components/dataset/AddDataset.vue'

import AllDataTables from '@/components/datatable/AllDataTables.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
