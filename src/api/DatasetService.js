import axios from 'axios';
import {settings} from '@/settings'

class DatasetService {
  getAllDatasets() {
    return axios.get(settings.url + '/dataset/get-all-datasets')
  }

  getDataTablesForDataset(datasetId) {
    return axios.get(settings.url + '/dataset/get-dataset-datatables/'+ datasetId)
  }

  createNewDataset(datasetName, datasetDescription) {
    let formData = new FormData();
    formData.append("name", datasetName);
    formData.append("description", datasetDescription);
    return axios.post(settings.url + '/dataset/create-new-dataset', formData)
  }
}

export default new DatasetService;
