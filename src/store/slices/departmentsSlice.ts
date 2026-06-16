import { UnknownAction , PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Department } from '../../types/models';
import { 
    addDepartment, 
    addEducation, 
    addEmployee, 
    addWorkExperience, 
    deleteDepartment, 
    deleteEducation, 
    deleteEmployee, 
    deleteFile, 
    deleteWorkExperience, 
    editDepartment, 
    editEmployee, 
    getDepartments, 
    uploadFile 
} from '../../services';

const NAME = 'departments';

interface DepartmentsState {
    departments: Array<Department>;
    loading: boolean;
    departmentsError?: string | null;
}

const initialState: DepartmentsState = {
    departments: [],
    loading: false,
    departmentsError: undefined
}

const isLoading = (action: UnknownAction ) => action.type.endsWith('pending');

const isError = (action: UnknownAction ) => action.type.endsWith('rejected');

const setState = (state: any, action: any) => {
    state.departments = action.payload;
    state.departmentsError = undefined;
    state.loading = false;
}

const departmentsSlice = createSlice({
    name: NAME,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getDepartments.fulfilled, (state, action) => {
                setState(state, action);
            })
            .addCase(addDepartment.fulfilled, (state, action) => {
                setState(state, action);
            })
            .addCase(editDepartment.fulfilled, (state, action) => {
                setState(state, action);
            })
            .addCase(deleteDepartment.fulfilled, (state, action) => {
                setState(state, action);
            })
            .addCase(addEmployee.fulfilled, (state, action) => {
                setState(state, action);
            })
            .addCase(editEmployee.fulfilled, (state, action) => {
                setState(state, action);
            })
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                setState(state, action);
            })
            .addCase(addEducation.fulfilled, (state, action) => {
                setState(state, action);
            })
            .addCase(deleteEducation.fulfilled, (state, action) => {
                setState(state, action);
            })
            .addCase(addWorkExperience.fulfilled, (state, action) => {
                setState(state, action);
            })
            .addCase(deleteWorkExperience.fulfilled, (state, action) => {
                setState(state, action);
            })
            .addCase(uploadFile.fulfilled, (state, action) => {
                setState(state, action);
            })
            .addCase(deleteFile.fulfilled, (state, action) => {
                setState(state, action);
            })
            .addMatcher(isLoading, (state) => {
                state.loading = true;
                state.departmentsError = undefined;
            })
            .addMatcher(isError, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.departmentsError = action.payload;
            })
    }
});

export const departmentsReducer = departmentsSlice.reducer;
