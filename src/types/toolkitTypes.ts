import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';

export interface AsyncThunkOptions {
    rejectValue: string;
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>;
}
