import axios from "axios";

const api = axios.create({
    baseURL:"http://localhost:3000/",
    withCredentials: true
})

api.interceptors.response.use(
    response => response,
    async error =>{
        const originalRequest = error.config;

        if(error.response && error.response.status == 401 && !originalRequest._retry){
            originalRequest._retry = true;
            try{
                await api.post("/user/refresh");
                return api(originalRequest);
            }
            catch(refreshError){
                console.error("Refresh Failed", refreshError);
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
)
export default api;