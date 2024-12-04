import { Dimensions } from 'react-native';
import { appAxios } from './apiinceptor';
import { tokenStorage } from '../state/Storage';
import axios from 'axios';


export const { width, height } = Dimensions.get('window');

export const BackendUrl = 'http://192.168.201.47:8002/';




export const refetchUser = async (setUser: any) => {
  try {
    const response = await appAxios.get('/user');
    setUser(response.data.user);
  } catch (error) {
    console.log('Error refetching user', error);
  }
};

export const refresh_tokens = async () => {
  try {
    const refreshToken = tokenStorage.getString('refreshToken');

    const response = await axios.post(`${BackendUrl}/refresh-token`, {
      refreshToken,
    });

    const new_access_token = response.data.accessToken;
    const new_refresh_token = response.data.refreshToken;

    tokenStorage.set('accessToken', new_access_token);
    tokenStorage.set('refreshToken', new_refresh_token);

    return new_access_token;
  } catch (error) {
    console.log('Error refreshing token', error);
    tokenStorage.clearAll();
    // navigation.navigate(");
  }
};


