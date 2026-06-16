import { configureStore } from '@reduxjs/toolkit';
import { administrationReducer, departmentsReducer, userReducer } from './slices';

export const store = configureStore({
    reducer: {
        administration: administrationReducer,
        departments: departmentsReducer,
        user: userReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
