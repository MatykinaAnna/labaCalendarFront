import { FC, useEffect } from 'react';
import { Layout } from '../../components/layouts';
import { UsersList } from '../../components/usersList';
import { Button } from '../../components';
import { useNavigate } from 'react-router-dom';
import { RoutesPaths } from '../../constants/commonConstants';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxToolkitHooks';
import { getUsers, setUserRole } from '../../services';
import './administrationPageStyles.scss';

export const AdministrationPage: FC = () => {
    const { users } = useAppSelector((state) => state.administration);
    const { accessToken, role } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();    
    const navigate = useNavigate();

    useEffect(() => {
        if(accessToken) {
            if(role === 'user' || role === 'manager' || !role) {
                navigate(`${RoutesPaths.NoPermissions}`);
            } else {
                dispatch(getUsers());
            }
        } else {
            navigate(`${RoutesPaths.Login}`);
        }
    }, [accessToken, role, navigate, dispatch]);


    const setAdminRoleHandler = (id: number) => {
        dispatch(setUserRole({userId: id, roleName: 'admin'}));
    }

    const setManagerRoleHandler = (id: number) => {
        dispatch(setUserRole({userId: id, roleName: 'manager'}));
    }

    const resetPermissionsHandler = (id: number) => {
        dispatch(setUserRole({userId: id, roleName: 'user'}));
    }

    return (
        <Layout title="Администрирование">
            <Button text="На главную" 
                onClick={() => navigate(`/${RoutesPaths.Departments}`)} 
                className="navigate-btn"
                type="primary"
            />
            <UsersList onSetAdminRole={setAdminRoleHandler} 
                onSetManagerRole={setManagerRoleHandler} 
                onResetPermissions={resetPermissionsHandler}
                usersList={users}
            />
        </Layout>
    );
}
