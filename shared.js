import axios from "axios";
// const apiUrl = "http://localhost:4000/api";

const baseFileUrl =
  window.location.hostname === "localhost"
    ? "http://localhost:4000/uploads/"
    : "https://foliogen.herokuapp.com/uploads/";

const baseFileUrl2 =
  window.location.hostname === "localhost"
    ? "http://localhost:4000/api/files"
    : "https://foliogen.herokuapp.com/api/files";

const apiUrl =
  window.location.hostname === "localhost"
    ? "http://localhost:4000/api"
    : "https://foliogen.herokuapp.com/api";

// const apiUrl = "https://foliogen.herokuapp.com/api";

const baseUrl = axios.create({ baseURL: apiUrl, withCredentials: true });
// const baseUrl = axios.create({ baseURL: apiUrl });

const errHandling = (error) => Promise.reject(error);

const reqHandling = (config) => {
  const obj = { ...config };
  const token = localStorage.getItem("token");
  if (token) obj.headers["authorization"] = `Bearer ${token}`;
  // obj.withCredentials=true;
  return obj;
};

const resHandling = (response) => response;

baseUrl.interceptors.request.use(reqHandling, errHandling);
baseUrl.interceptors.response.use(resHandling, errHandling);
// baseUrl.defaults.withCredentials = true
// export default axiosInstance;

export { baseUrl, baseFileUrl, baseFileUrl2 };
