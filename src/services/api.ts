import axios from 'axios';

const api = axios.create({
  baseURL: 'http://dev.seconds.com.br/',
});

export default api;
