import axios from 'axios';
import {settings} from '@/settings'

class DatasetService {
  getAllDatasetDtos() {
    return axios.get(settings.url + '/dataset/get-all-dataset-dtos')
  }

  createNewDataset(datasetName, datasetDescription) {
    let formData = new FormData();
    formData.append("name", datasetName);
    formData.append("description", datasetDescription);
    return axios.post(settings.url + '/dataset/create-new-dataset', formData)
  }

  getDatasetsCreatedByOfficer() {
    return axios.get(settings.url + '/dataset/get-all-datasets-created')
  }
}

export default new DatasetService;
