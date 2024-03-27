import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { authService as authSvc } from '@/services/auth.service.ts';
//import { getToken } from "@/core/services"; 
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

//   console.log("init Axios interceptor");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateHeader = (request: any) => {
    const token = "Bearer " + authSvc.getToken();

    const newHeaders = {
        Authorization: token,
        "Content-Type": "application/json",
    };
    request.headers = newHeaders;

    return request;
};

// Interceptor para las solicitudfr
instance.interceptors.request.use((request) => {
    // Ignorar las solicitudes que contienen "assets" en la URL
    if (request.url?.includes("assets") || request.headers?.Authorization) {
        return request;
    }
    return updateHeader(request);
}
);


// Interceptor para las respuestas
instance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        return response;
    },
    (error) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            // console.log(error.response.data);
            // console.log(error.response.status);
            // console.log(error.response.headers);
        }
        // const redirect = () => {
        //   window.location.href = `/${PublicRoutes.LOGIN}`;
        // };
        // //No esta logueado a la aplicacion
        // if (error.response.status === 401) {
        //   console.log(error);
        //   // redirect();
        // }   
        // SnackbarUtilities.error(getValidationError(error.code)!);
        // SnackbarUtility.error(error.message);
        return Promise.reject(error);
    }
);


// const axios = <T>(cfg: AxiosRequestConfig): Promise<ApiResponse> =>
//   instance.request<any, T>(cfg);

const http = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
    return instance.request(config).then((response) => {
        return response;
    });
};

export { http };
