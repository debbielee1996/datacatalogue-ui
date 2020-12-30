import axios from 'axios';
import {settings} from '@/settings'

class DatasetService {
  getAllDatasetDtos() {
    return axios.get(settings.url + '/dataset/get-all-dataset-dtos')
  }

  createNewDataset(datasetName, datasetDescription, custodianPfs, ownerPf) {
    let formData = new FormData();
    formData.append("name", datasetName);
    formData.append("description", datasetDescription);
    formData.append("custodianPfs", custodianPfs);
    formData.append("ownerPf", ownerPf);
    return axios.post(settings.url + '/dataset/create-new-dataset', formData)
  }

  getDatasetsCreatedByOfficer() {
    return axios.get(settings.url + '/dataset/get-all-datasets-created')
  }

  datasetNameIsUnique(datasetName) {
    return axios.get(settings.url + '/dataset/datasetname-isunique', {
      params: {
        datasetName: datasetName
      }
    })
  }
}

export default new DatasetService;
