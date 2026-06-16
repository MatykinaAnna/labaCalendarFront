import { createAsyncThunk } from '@reduxjs/toolkit';
import { SetRoleResponseDto } from '../types/apiTypes';
import { AsyncThunkOptions } from '../types/toolkitTypes';
import { AdministrationApi } from '../api';
import { User } from '../types/models';

const NAMESPACE = 'administration';

export const getUsers = createAsyncThunk<Array<User>, undefined, AsyncThunkOptions>(
    `${NAMESPACE}/getUsers`,
    async(_, { rejectWithValue }) => {
        try {
            return await AdministrationApi().getUsers();
        } catch(error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const setUserRole = createAsyncThunk<Array<User>, SetRoleResponseDto, AsyncThunkOptions>(
    `${NAMESPACE}/setUserRole`,
    async(setRoleData, { rejectWithValue }) => {
        try {
            await AdministrationApi().setUserRole(setRoleData);
            return await AdministrationApi().getUsers();
        } catch(error) {
            return rejectWithValue((error as Error).message);
        }
    }
);
