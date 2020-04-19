import axios from 'axios'
import config from '../config'

const fetchData = async (options = {}) => {
  const params = { ...options }
  return axios.get(
    config.externalUrl,
    {
      headers: {
        ...config.externalAuthen
      },
      params
    }
  )
}

module.exports = { fetchData }
