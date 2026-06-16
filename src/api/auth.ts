import { AccessTokenKey } from '../constants/commonConstants';
import { LoginRequestDto, LoginResponseDto, RegistrationRequestDto } from '../types/apiTypes';
import { AxiosInstance } from './axiosInstance';

export const AuthApi = () =>{
    const {axiosPost} = AxiosInstance();

    const signIn = async(loginData: LoginRequestDto) => {
        const data = await axiosPost('/login', loginData) as LoginResponseDto;
        sessionStorage.setItem(AccessTokenKey, data.access_token);
        return data;
    }

    const signUp = async(registrationData: RegistrationRequestDto) => 
        await axiosPost('/register', registrationData) as void;

    return  {
        signIn,
        signUp
    }
}
