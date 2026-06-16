/* eslint-disable no-extend-native */
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages';
import { RegistrationPage } from './pages/registration';
import { RoutesPaths } from './constants/commonConstants';
import { DepartmentsPage } from './pages/department';
import { AdministrationPage } from './pages/administration';
import { NoPermissionsPage } from './pages/noPermissions';
import { CalendarPage } from './pages/calendar'
import './styles/globalStyles.scss';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path={RoutesPaths.Login} element={<LoginPage />} />
      <Route path={RoutesPaths.Registration} element={<RegistrationPage />} />
      <Route path={RoutesPaths.Departments} element={<DepartmentsPage />} />
      <Route path={RoutesPaths.Administration} element={<AdministrationPage />} />
      <Route path={RoutesPaths.NoPermissions} element={<NoPermissionsPage />} />
      <Route path={RoutesPaths.CalendarPage} element={<CalendarPage />} />
      <Route path={'*'} element={<LoginPage />} />
    </Routes>
  );
};
