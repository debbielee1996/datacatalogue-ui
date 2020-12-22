import { settings } from '@/settings'
import axios from 'axios'

class DataTableColumnService {
  getAllDataColumnDtos(dataTableId) {
      return axios.get(settings.url + '/datatablecolumn/get-all-columns-dtos/' + dataTableId)
  }

  editDataTableColumnName(dataTableColumnId, dataTableColumnName) {
    let formData = new FormData()
    formData.append("dataTableColumnId", dataTableColumnId)
    formData.append("name", dataTableColumnName)
    return axios.post(settings.url + '/datatablecolumn/edit-description', formData)
  }

  editDataTableColumnDescription(dataTableColumnId, dataTableColumnDescription) {
    let formData = new FormData()
    formData.append("dataTableColumnId", dataTableColumnId)
    formData.append("description", dataTableColumnDescription)
    return axios.post(settings.url + '/datatablecolumn/edit-description', formData)
  }
}

export default new DataTableColumnService;