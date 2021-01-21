import {settings} from '@/settings';
import axios from 'axios';

class DataTableService {
  getAllDataTableDtos() {
    return axios.get(settings.url + '/datatable/get-all-datatable-dtos')
  }

  getAllPublicDataTableDtos() {
    return axios.get(settings.url + '/datatable/get-all-public-datatable-dtos')
  }

  getDataTablesForDataset(datasetId) {
    return axios.get(settings.url + '/datatable/get-dataset-datatables/'+ datasetId)
  }

  getDataTablesCreatedByOfficer() {
    return axios.get(settings.url + '/datatable/get-all-datatables-created')
  }

  uploadFile(file, dataTableName, selectedDatasetId, dataTableDescription, selectedDataTypes, dataColDescriptions,dataTablePrivacy) {
    let formData = new FormData();
    formData.append("file", file)
    formData.append("tableName", dataTableName);
    formData.append("datasetId", selectedDatasetId);
    formData.append("description", dataTableDescription);
    formData.append("dataTypes", selectedDataTypes);
    formData.append("dataColDescriptions", dataColDescriptions);
    formData.append("isPublic", dataTablePrivacy);
    return axios.post(settings.url + '/datatable/upload-file', formData)
  }

  editDataTableDescription(dataTableId, dataTableDescription) {
    let formData = new FormData()
    formData.append("dataTableId", dataTableId)
    formData.append("description", dataTableDescription)
    return axios.post(settings.url + '/datatable/edit-description', formData)
  }
  editDataTablePrivacy(dataTableId, dataTablePrivacy) {
    let formData = new FormData()
    formData.append("dataTableId", dataTableId)
    formData.append("isPublic", dataTablePrivacy)
    return axios.post(settings.url + '/datatable/edit-privacy', formData)
  }


  dataTableNameIsUnique(dataTableName, datasetId) {
    if (datasetId.length!=0) {
      return axios.get(settings.url + '/datatable/datatablename-isunique', {
        params: {
          dataTableName: dataTableName,
          datasetId: datasetId
        }
      })
    }
  }
}

export default new DataTableService;