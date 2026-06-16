import { AccessTokenKey } from '../constants/commonConstants';
import { SetRoleResponseDto } from '../types/apiTypes';
import { User } from '../types/models';
import { AxiosInstance } from './axiosInstance';

export const AdministrationApi = () => {
    const token = sessionStorage.getItem(AccessTokenKey) ?? '';

    const { axiosGet, axiosPatch} = AxiosInstance(token);

    const getUsers = async() =>
        await axiosGet('/Administration/getusers') as Array<User>;

    const setUserRole = async(setRoleData: SetRoleResponseDto) => 
        await axiosPatch('/Administration/setuserrole', setRoleData) as void;


    return { 
        getUsers,
        setUserRole
    }
}
