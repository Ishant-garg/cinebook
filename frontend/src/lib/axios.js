import axios from "axios";
//https://3aca-103-212-146-196.ngrok-free.app/api
const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
    
});

export default axiosInstance