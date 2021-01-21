import { settings } from '@/settings'
import axios from 'axios'

class DataTableColumnService {
  getAllDataColumnDtos(dataTableId) {
      return axios.get(settings.url + '/datatablecolumn/get-all-columns-dtos/' + dataTableId)
  }
  getAllPublicDataColumnDtos(dataTableId) {
    return axios.get(settings.url + '/datatablecolumn/get-all-public-columns-dtos/' + dataTableId)
}
  editDataTableColumnDescription(dataTableColumnId, dataTableColumnDescription) {
    let formData = new FormData()
    formData.append("dataTableColumnId", dataTableColumnId)
    formData.append("description", dataTableColumnDescription)
    return axios.post(settings.url + '/datatablecolumn/edit-description', formData)
  }
  editDataTableColumnPrivacy(dataTableColumnPrivacyList) {
    let formData = new FormData()
    formData.append("dataTableColumnPrivacyList",dataTableColumnPrivacyList)
    return axios.post(settings.url + '/datatablecolumn/edit-privacy', formData)
  }
}

export default new DataTableColumnService;