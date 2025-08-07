import axios from "axios";

const request = axios.create({
  baseURL: "https://laosecom.onrender.com/api",
  timeout: 5000,
});

export default request;
