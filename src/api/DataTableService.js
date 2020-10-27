import {settings} from '@/settings';
import axios from 'axios';

class DataTableService {
  getAllDataTableDtos() {
    return axios.get(settings.url + '/datatable/get-all-datatable-dtos')
  }

  getDataTablesForDataset(datasetId) {
    return axios.get(settings.url + '/datatable/get-dataset-datatables/'+ datasetId)
  }

  getDataTablesCreatedByOfficer() {
    return axios.get(settings.url + '/datatable/get-all-datatables-created')
  }

  uploadFile(file, dataTableName, selectedDatasetId, dataTableDescription, selectedDataTypes, dataColDescriptions) {
    let formData = new FormData();
    formData.append("file", file)
    formData.append("tableName", dataTableName);
    formData.append("datasetId", selectedDatasetId);
    formData.append("description", dataTableDescription);
    formData.append("dataTypes", selectedDataTypes);
    formData.append("dataColDescriptions", dataColDescriptions);
    return axios.post(settings.url + '/datatable/upload-file', formData)
  }
}

export default new DataTableService;