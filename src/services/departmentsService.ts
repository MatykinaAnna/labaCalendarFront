import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
    AddDepartmentResponseDto, 
    AddEducationResponseDto, 
    AddEmployeeResponseDto, 
    AddWorkExperienceResponseDto, 
    EditDepartmentResponseDto, 
    UpdateEmployeeResponseDto, 
    UploadFileResponseDto
} from '../types/apiTypes';
import { AsyncThunkOptions } from '../types/toolkitTypes';
import { DepartmentsApi, EmployeeApi, FilesApi } from '../api';
import { Department } from '../types/models';

const NAMESPACE = 'departments';

export const getDepartments = createAsyncThunk<Array<Department>, undefined, AsyncThunkOptions>(
    `${NAMESPACE}/getDepartments`,
    async(_, { rejectWithValue }) => {
        try {
            return await DepartmentsApi().getDepartments();
        } catch(error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const addDepartment = createAsyncThunk<Array<Department>, AddDepartmentResponseDto, AsyncThunkOptions>(
    `${NAMESPACE}/addDepartment`,
    async(addDepartmentData, { rejectWithValue }) => {
        try {
            await DepartmentsApi().addDepartment(addDepartmentData);
            return await DepartmentsApi().getDepartments();
        } catch(error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const editDepartment = createAsyncThunk<Array<Department>, EditDepartmentResponseDto, AsyncThunkOptions>(
    `${NAMESPACE}/editDepartment`,
    async(editDepartmentData, { rejectWithValue }) => {
        try {
            await DepartmentsApi().editDepartment(editDepartmentData);
            return await DepartmentsApi().getDepartments();
        } catch(error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const deleteDepartment = createAsyncThunk<Array<Department>, string | number, AsyncThunkOptions>(
    `${NAMESPACE}/deleteDepartment`,
    async(id, { rejectWithValue }) => {
        try {
            await DepartmentsApi().deleteDepartment(id);
            return await DepartmentsApi().getDepartments();
        } catch(error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const addEmployee = createAsyncThunk<Array<Department>, AddEmployeeResponseDto, AsyncThunkOptions>(
    `${NAMESPACE}/addEmployee`,
    async(addEmployeeData, { rejectWithValue }) => {
        try {
            await EmployeeApi().addEmployee(addEmployeeData);
            return await DepartmentsApi().getDepartments();
        } catch(error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const editEmployee = createAsyncThunk<Array<Department>, UpdateEmployeeResponseDto, AsyncThunkOptions>(
    `${NAMESPACE}/editEmployee`,
    async(editEmployeeData, { rejectWithValue }) => {
        try {
            await EmployeeApi().editEmployee(editEmployeeData);
            return await DepartmentsApi().getDepartments();
        } catch(error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const deleteEmployee = createAsyncThunk<Array<Department>, string | number, AsyncThunkOptions>(
    `${NAMESPACE}/deleteEmployee`,
    async(id, { rejectWithValue }) => {
        try {
            await EmployeeApi().deleteEmployee(id);
            return await DepartmentsApi().getDepartments();
        } catch(error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const addEducation = createAsyncThunk<Array<Department>, AddEducationResponseDto, AsyncThunkOptions>(
    `${NAMESPACE}/addEducation`,
    async(addEducationData, { rejectWithValue }) => {
        try {
            await EmployeeApi().addEducation(addEducationData);
            return await DepartmentsApi().getDepartments();
        } catch(error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const deleteEducation = createAsyncThunk<Array<Department>, string | number, AsyncThunkOptions>(
    `${NAMESPACE}/deleteEducation`,
    async(id, { rejectWithValue }) => {
        try {
            await EmployeeApi().deleteEducation(id);
            return await DepartmentsApi().getDepartments();
        } catch(error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const addWorkExperience = createAsyncThunk<Array<Department>, AddWorkExperienceResponseDto, AsyncThunkOptions>(
    `${NAMESPACE}/addWorkExperience`,
    async(addWEData, { rejectWithValue }) => {
        try {
            await EmployeeApi().addWorkExperience(addWEData);
            return await DepartmentsApi().getDepartments();
        } catch(error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const deleteWorkExperience = createAsyncThunk<Array<Department>, string | number, AsyncThunkOptions>(
    `${NAMESPACE}/deleteWorkExperience`,
    async(id, { rejectWithValue }) => {
        try {
            await EmployeeApi().deleteWorkExperience(id);
            return await DepartmentsApi().getDepartments();
        } catch(error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const uploadFile = createAsyncThunk<Array<Department>, UploadFileResponseDto, AsyncThunkOptions>(
    `${NAMESPACE}/uploadFile`,
    async(uploadFileData, { rejectWithValue }) => {
        try {
            await FilesApi().uploadFile(uploadFileData);
            return await DepartmentsApi().getDepartments();
        } catch(error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const deleteFile = createAsyncThunk<Array<Department>, string | number, AsyncThunkOptions>(
    `${NAMESPACE}/deleteFile`,
    async(id, { rejectWithValue }) => {
        try {
            await FilesApi().deleteFile(id);
            return await DepartmentsApi().getDepartments();
        } catch(error) {
            return rejectWithValue((error as Error).message);
        }
    }
);
