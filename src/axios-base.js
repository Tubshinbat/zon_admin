import axios from "axios";

const instance = axios.create({
  // baseURL: "http://admin.zaya-ananda.com/api/",
  baseURL: "http://localhost:8060/api/v1/",
});

instance.defaults.withCredentials = true;

export default instance;
