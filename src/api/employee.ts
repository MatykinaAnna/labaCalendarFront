import { AccessTokenKey } from '../constants/commonConstants';
import { 
    AddEducationResponseDto, 
    AddEmployeeResponseDto, 
    AddWorkExperienceResponseDto, 
    UpdateEmployeeResponseDto 
} from '../types/apiTypes';
import { AxiosInstance } from './axiosInstance';

export const EmployeeApi = () => {
    const token = sessionStorage.getItem(AccessTokenKey) ?? '';

    const { axiosDelete, axiosPut, axiosPost} = AxiosInstance(token);

    const addEmployee = async(addEmployeeData: AddEmployeeResponseDto) => 
        await axiosPost('/Employees/employee', addEmployeeData) as number;

    const editEmployee = async(editEmployeeData: UpdateEmployeeResponseDto) => 
        await axiosPut('/Employees/employee', editEmployeeData) as void;

    const deleteEmployee = async(id: string | number) => 
        await axiosDelete(`/Employees/employee?id=${id}`) as void;

    const addWorkExperience = async(addWEData: AddWorkExperienceResponseDto) => 
        await axiosPost('/Employees/workexperience', addWEData) as number;

    const deleteWorkExperience = async(id: string | number) => 
        await axiosDelete(`/Employees/workexperience?id=${id}`) as void;

    const addEducation = async(addEducationData: AddEducationResponseDto) => 
        await axiosPost('/Employees/education', addEducationData) as number;

    const deleteEducation = async(id: string | number) => 
        await axiosDelete(`/Employees/education?id=${id}`) as void;

    return {
        addEmployee,
        editEmployee,
        deleteEmployee,
        addWorkExperience,
        deleteWorkExperience,
        addEducation,
        deleteEducation
    };
}
