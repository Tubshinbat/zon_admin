import axios from "axios";

const instance = axios.create({
  baseURL: "https://adminbeta.metaldoor.mn/api/",
  // baseURL: "http://localhost:8060/api/v1/",
});

instance.defaults.withCredentials = true;

export default instance;
