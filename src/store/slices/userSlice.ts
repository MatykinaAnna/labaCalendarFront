import { UnknownAction , PayloadAction, createSlice } from '@reduxjs/toolkit';
import { signIn, signUp } from '../../services';
import { AccessTokenKey, RoleKey, UserNameKey } from '../../constants/commonConstants';

const NAME = 'user';

const getItemFromSessionStorage = (itemKey: string) => {
    const item = sessionStorage.getItem(itemKey);
    return item ?? undefined;
}

const setItemToSessionStorage = (itemKey: string, value?: string | null) => {
    if(!value) {
        sessionStorage.removeItem(itemKey);
    } else {
        sessionStorage.setItem(itemKey, value);
    }
}

interface UserState {
    loading: boolean;
    accessToken?: string | null;
    userName?: string | null;
    role?: string | null;
    userError?: string | null;
}

const initialState: UserState = {
    loading: false,
    accessToken: getItemFromSessionStorage(AccessTokenKey),
    role: getItemFromSessionStorage(RoleKey),
    userName: getItemFromSessionStorage(UserNameKey)
}

const isLoading = (action: UnknownAction ) => action.type.endsWith('pending');

const isError = (action: UnknownAction ) => action.type.endsWith('rejected');

const userSlice = createSlice({
    name: NAME,
    initialState,
    reducers: {
        logOut(state) {
            state.accessToken = undefined;
            state.role = undefined;
            state.userName = undefined;
            state.loading = false;
            state.userError = undefined;
            setItemToSessionStorage(AccessTokenKey, null);
            setItemToSessionStorage(RoleKey, null);
            setItemToSessionStorage(UserNameKey, null);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signIn.fulfilled, (state, action) => {
                state.loading = false;
                state.accessToken = action.payload.access_token;
                state.userName = action.payload.usename;
                state.role = action.payload.role;
                setItemToSessionStorage(AccessTokenKey, action.payload.access_token);
                setItemToSessionStorage(RoleKey, action.payload.role);
                setItemToSessionStorage(UserNameKey, action.payload.usename);
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.loading = false;
                state.accessToken = action.payload.access_token;
                state.userName = action.payload.usename;
                state.role = action.payload.role;
                setItemToSessionStorage(AccessTokenKey, action.payload.access_token);
                setItemToSessionStorage(RoleKey, action.payload.role);
                setItemToSessionStorage(UserNameKey, action.payload.usename);
            })
            .addMatcher(isLoading, (state) => {
                state.loading = true;
                state.userError = undefined;
            })
            .addMatcher(isError, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.userError = action.payload;
            })
    }
});

export const userReducer = userSlice.reducer;

export const { logOut } = userSlice.actions;
