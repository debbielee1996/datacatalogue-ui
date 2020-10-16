import {settings} from '@/settings';
import axios from 'axios';

class DataTableService {
  getAllDataTables() {
    return axios.get(settings.url + '/datatable/get-all-datatables')
  }

  getAllDataTableNames() {
    return axios.get(settings.url + '/datatable/get-all-datatable-names')
  }

  uploadFile(file, dataTableName, selectedDatasetId, dataTableDescription, selectedDataTypes) {
    let formData = new FormData();
    formData.append("file", file)
    formData.append("tableName", dataTableName);
    formData.append("datasetId", selectedDatasetId);
    formData.append("description", dataTableDescription);
    formData.append("dataTypes", selectedDataTypes);
    return axios.post(settings.url + '/datatable/upload-file', formData)
  }
}

export default new DataTableService;