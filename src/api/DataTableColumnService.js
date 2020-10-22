import { settings } from '@/settings'
import axios from 'axios'

class DataTableColumnService {
  getAllDataColumnDtos(dataTableId) {
      return axios.get(settings.url + '/datatablecolumn/get-all-columns-dtos/' + dataTableId)
  }
}

export default new DataTableColumnService;