const axios = require('axios');
const config = require('../config')

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
  );
};

module.exports = { fetchData };
