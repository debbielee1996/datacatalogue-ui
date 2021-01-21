import {settings} from '@/settings';
import axios from 'axios';

class OfficerService {
  getAllOfficersDto() {
    return axios.get(settings.url + '/officer/get-all-officers')
  }
}

export default new OfficerService