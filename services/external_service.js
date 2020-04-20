import axios from 'axios'
import config from '../config'

const externalService = axios.create({
  baseURL: config.externalUrl,
  headers: {
    'X-Parse-Application-Id': config.externalId,
    'X-Parse-Master-Key': config.externalKey
  }
})

const fetchData = async (options = {}) => {
  const params = { ...options }
  return externalService.get('', { params })
}

module.exports = { fetchData }
