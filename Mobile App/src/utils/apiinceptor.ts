import axios from 'axios';



import { Alert } from 'react-native';
import { BackendUrl, refresh_tokens } from './utils';
import { tokenStorage } from '../state/Storage';

export const appAxios = axios.create({
  baseURL: BackendUrl,
});

appAxios.interceptors.request.use(async config => {
  const accessToken = tokenStorage.getString('accessToken');

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});


appAxios.interceptors.response.use(
    response=>response,
    async error=>{
        if(error.response && error.response.status===401){
            try {
                const newAccessToken = await refresh_tokens()
                if(newAccessToken){
                    error.config.headers.Authorization=`Bearer ${newAccessToken}`
                    return axios(error.config)
                }
            } catch (error) {
                console.log("Error refreshing token")
            }
        }
        if(error.response && error.response.status!=401){
            const errorMessage = error.response.data.message || "something went wrong"
            Alert.alert("Error",errorMessage)
        }
        return Promise.resolve(error)
    }
)
