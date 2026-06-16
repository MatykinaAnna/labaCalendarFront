/* eslint-disable no-restricted-globals */
import { ChangeEventHandler, FC, useEffect, useRef, useState } from 'react';
import { Layout } from '../../components/layouts';
import { Button, Dialog, DropDown, EducationList, EmployeesList, FilesList, TextField, WorkExperienceList } from '../../components';
import { Employee } from '../../types/models';
import { DropDownItem } from '../../components/dropDown/DropDownProps';
import { PencilIcon, PlusIcon, TrashIcon, UploadIcon } from '../../assets/icons';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxToolkitHooks';
import { useNavigate } from 'react-router-dom';
import { RoutesPaths } from '../../constants/commonConstants';
import { addDepartment, addEducation, addEmployee, addWorkExperience, deleteDepartment, deleteEducation, deleteEmployee, deleteFile, deleteWorkExperience, editDepartment, editEmployee, getDepartments, uploadFile } from '../../services';
import './departmentsPageStyles.scss';
import { FilesApi } from '../../api';

export const DepartmentsPage: FC = () => {
    const { role, accessToken } = useAppSelector((state) => state.user);
    const { departments } = useAppSelector((state) => state.departments);
    const dispatch = useAppDispatch();

    const [employeesData, setEmployeesData] = useState<Array<Employee>>([]);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<number>();
    const [selectedEmployee, setSelectedEmployee] = useState<Employee>();
    const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);
    const [userActionMode, setUserActionMode] = useState<'create' | 'edit'>('create');
    const [showDepartmentDialog, setShowDepartmentDialog] = useState(false);
    const [departmentActionMode, setDepartmentActionMode] = useState<'create' | 'edit'>('create');
    const [userToEdit, setUserToEdit] = useState(0);
    
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [midleName, setMidleName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    
    const [departmentName, setDepartmentName] = useState('');

    const [showEducationDialog, setShowEducationDialog] = useState(false);
    const [educationName, setEducationName] = useState('');
    const [educationDescription, setEducationDescription] = useState('');

    const [showWorkExpDialog, setShowWorkExpDialog] = useState(false);
    const [workName, setWorkName] = useState('');
    const [workExp, setWorkExp] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if(accessToken) {
            if(role === 'user' || !role) {
                navigate(`${RoutesPaths.NoPermissions}`);
            } else {
                dispatch(getDepartments());
            }
        } else {
            navigate(`${RoutesPaths.Login}`);
        }
    }, [accessToken, role, navigate, dispatch]);

    useEffect(() => {
        const selectedDepartment = selectedDepartmentId 
            ? departments.find(d => d.id === selectedDepartmentId)
            : departments[0];
        setSelectedDepartmentId(selectedDepartment?.id);
        setEmployeesData(selectedDepartment ? selectedDepartment.employees : []);
        if(selectedEmployee && selectedDepartment) {
            const findedSelectedEmployee 
                = selectedDepartment.employees
                    .find(e => e.id === selectedEmployee.id);
            setSelectedEmployee(findedSelectedEmployee);
        } else if (selectedDepartment?.employees.length) {
            setSelectedEmployee(selectedDepartment.employees[0]);
        } else {
            setSelectedEmployee(undefined);
        }
    }, [departments, selectedDepartmentId, selectedEmployee]);

    useEffect(() => {
        if(userActionMode === 'edit') {
            const employee = userActionMode === 'edit' 
                ? employeesData.find(e => e.id === userToEdit) 
                : undefined;    

            setLastName(employee?.lastName ?? '');
            setFirstName(employee?.firstName ?? '');
            setMidleName(employee?.midleName ?? '');
            setBirthDate(employee?.birthDate ?? '');
            setEmail(employee?.email ?? '');
            setPhoneNumber(employee?.phoneNumber ?? '');
        }
    }, [employeesData, userActionMode, userToEdit])

    const clearEmployeeDialogFields = () => {
        setUserActionMode('create');
        setUserToEdit(0);
        setLastName('');
        setFirstName('');
        setMidleName('');
        setBirthDate('');
        setEmail('');
        setPhoneNumber('');
    }

    const createEmployeeHandler = () => {
        setUserActionMode('create');
        setShowEmployeeDialog(true);
    }

    const editEmployeeHandler = (id: number) => {
        setUserActionMode('edit');
        setUserToEdit(id);
        setShowEmployeeDialog(true);
    }

    const deleteEmployeeHandler = (id: number) => {
        setUserToEdit(id);
        if(confirm('Вы действительно хотите удалить данного сотрудника?')) {
            dispatch(deleteEmployee(id));
        }
    }

    const closeEmployeeDialogHandler = () =>{
        setShowEmployeeDialog(false);
        clearEmployeeDialogFields();
    }
    
    const saveEmployeeDialogHandler = () => {
        if(!selectedDepartmentId) {
            closeEmployeeDialogHandler();
            return;
        }
        const savingEmployee = {
            departmentId: selectedDepartmentId,
            birthDate: new Date().toUTCString(),
            email,
            firstName,
            lastName,
            phoneNumber,
            midleName
        };
        if(userActionMode === 'create') {
            dispatch(addEmployee(savingEmployee))
        }
        if(userActionMode === 'edit' && selectedEmployee) {
            dispatch(editEmployee({
                ...savingEmployee,
                id: selectedEmployee.id,
                educations: selectedEmployee.educations,
                userFiles: selectedEmployee.userFiles,
                workExperience: selectedEmployee.workExperience
            }))
        }
        closeEmployeeDialogHandler();
    }

    const depatmentChangedHandler = (id?: string) => {
        const _id: number | undefined = !id ? undefined : +id;
        setSelectedDepartmentId(_id);
    }

    const onEmployeeSelectedHandler = (id: number) => {
        const employee = employeesData.find(e => e.id === id);
        setSelectedEmployee(employee);
    }

    const getFIO = () => {
        if(!selectedEmployee) {
            return '';
        }
        return `${selectedEmployee.lastName} ${selectedEmployee.firstName} ${selectedEmployee.midleName ?? ''}`.trim();
    }

    const fileToBase64 = (file: any, callback: (base64string: string) => void) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if(reader?.result && typeof reader.result === 'string') {
                const base64string = reader.result.split(',')[1];
                callback(base64string);
            } else {
                callback('');
            }
        }
    }

    const uploadFileHandler = () => {
        fileInputRef.current?.click();
    }

    const fileSelectHandler = (e: any ) => {
        const file = e.target.files[0];
        if(file) {
            fileToBase64(file, (base64String: string) => {
                dispatch(uploadFile({
                    employeeId: selectedEmployee!.id,
                    fileName: file.name,
                    fileString: base64String
                }))
            })
        }
    }

    const downloadFileHandler = (displayName: string, systemName: string) => {
        FilesApi().downloadFile({
            displayName,
            systemName
        }).then(data => {
            const blob = new Blob([data], {'type': 'application/octet-stream'});
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = displayName;
            link.click();
        });
    }

    const deleteFileHandler = (id: number) => {
        if(confirm('Вы действительно хотите удалить данный файл?')) {
            dispatch(deleteFile(id));
        }
    }

    const createDepartmentHandler = () => {
        setDepartmentActionMode('create');
        setShowDepartmentDialog(true);
    }

    const editDepartmentHandler = () => {
        setDepartmentActionMode('edit');
        setDepartmentName(departments.find(d=>d.id === selectedDepartmentId)?.name ?? '');
        setShowDepartmentDialog(true);
    }

    const closeDepartmentDialogHandler = () => {
        setShowDepartmentDialog(false);
        setDepartmentName('');
        setDepartmentActionMode('create');
    }

    const saveDepartmentHandler = () => {
        if(departmentActionMode === 'create') {
            dispatch(addDepartment({name: departmentName}))
            closeDepartmentDialogHandler();
            return;
        }
        if(!selectedDepartmentId) {
            closeDepartmentDialogHandler();
            return;
        }
        if(departmentActionMode === 'edit') {
            dispatch(editDepartment({
                id: selectedDepartmentId,
                name: departmentName
            }));
        }
        closeDepartmentDialogHandler();
    }

    const deleteDepartmentHandler = () => {
        if(selectedDepartmentId && confirm('Вы действительно хотите удалить данный отдел?')) {
            dispatch(deleteDepartment(selectedDepartmentId));
            setSelectedDepartmentId(undefined);
        }
    }

    return (
        <Layout>
            {role === 'admin' && (
                <Dialog title={departmentActionMode !== 'edit' ? 'Добавить отдел' : 'Изменить отдел'}
                    open={showDepartmentDialog} 
                    onSave={saveDepartmentHandler}
                    onCancel={closeDepartmentDialogHandler}
                >
                    <TextField labelText="Наименование" value={departmentName} onChange={(val) => setDepartmentName(val)}/>
                </Dialog>
            )}
            <Dialog title={userActionMode !== 'edit' ? 'Добавить сотрудника' : 'Изменить сотрудника'}
                open={showEmployeeDialog} 
                onSave={saveEmployeeDialogHandler}
                onCancel={closeEmployeeDialogHandler}
            >
                <TextField labelText="Фамилия" value={lastName} onChange={(val) => setLastName(val)}/>
                <TextField labelText="Имя" value={firstName} onChange={(val) => setFirstName(val)} />
                <TextField labelText="Отчество" value={midleName} onChange={(val) => setMidleName(val)} />
                {/* <TextField type="date" labelText="Дата рождения" value={birthDate} onChange={(val) => setBirthDate(val)} /> */}
                <TextField labelText="Email" value={email} onChange={(val) => setEmail(val)} />
                <TextField labelText="Телефон" value={phoneNumber} onChange={(val) => setPhoneNumber(val)} />
            </Dialog>
            <Dialog title="Данные об образовании"
                open={showEducationDialog} 
                onSave={() => {
                    dispatch(addEducation({
                        employeeId: selectedEmployee!.id,
                        title: educationName,
                        description: educationDescription
                    }));
                    setShowEducationDialog(false);
                    setEducationName('');
                    setEducationDescription('');
                }}
                onCancel={() => {
                    setShowEducationDialog(false);
                    setEducationName('');
                    setEducationDescription('');
                }}
            >
                <TextField labelText="Наименование" value={educationName} onChange={(val) => setEducationName(val)}/>
                <TextField labelText="Описание" value={educationDescription} onChange={(val) => setEducationDescription(val)}/>
            </Dialog>
            <Dialog title="Данные о рабочем опыте"
                open={showWorkExpDialog} 
                onSave={() => {
                    dispatch(addWorkExperience({
                        employeeId: selectedEmployee!.id,
                        workedYears: +workExp,
                        description: workName
                    }));
                    setShowWorkExpDialog(false);
                    setWorkName('');
                    setWorkExp('');
                }}
                onCancel={() => {
                    setShowWorkExpDialog(false);
                    setWorkName('');
                    setWorkExp('');
                }}
            >
                <TextField labelText="Место" value={workName} onChange={(val) => setWorkName(val)}/>
                <TextField type="number" labelText="Стаж" value={workExp} onChange={(val) => setWorkExp(val)}/>
            </Dialog>
            <input type="file" onChange={fileSelectHandler} style={{display: 'none'}} ref={fileInputRef} />
            <div className="dep-page">
                <div className="dep-page__users-list-container">
                    <div className="dep-page__departments-list">
                        <DropDown className="dep-page__departments-drop-down"
                            items={departments?.map(dd => {
                                    return {
                                        text: dd.name,
                                        value: dd.id.toString()
                                    } as DropDownItem;
                                }) ?? []
                            } 
                            label="Отделы:" 
                            selectedChanged={(val) => depatmentChangedHandler(val)}
                        />
                        {role === 'admin' && (<>
                            <PlusIcon width={16} height={16} className="dep-page__add-btn" onClick={createDepartmentHandler} />
                            <PencilIcon onClick={editDepartmentHandler} />
                            <TrashIcon onClick={deleteDepartmentHandler}/>
                            </>
                        )}
                    </div>
                    <EmployeesList employeesList={employeesData}
                        onItemClick={(id) => onEmployeeSelectedHandler(id)}
                        onItemDelete={deleteEmployeeHandler}
                        onItemEdit={editEmployeeHandler}
                    />
                    <Button text="Добавить сотрудника" className="dep-page__add-user-btn" onClick={createEmployeeHandler} />
                </div>
                <div className="dep-page__user-info-container">
                    <div className="dep-page__user-info-header">
                        <div className="dep-page__use-info-user">
                            <div className="dep-page__user-info-fullname">
                                {getFIO()}
                            </div>
                            <div className="dep-page__user-info-pers-data">
                                <div>
                                    <strong>Дата рождения: </strong>
                                    <span>{
                                        selectedEmployee?.birthDate 
                                            ? format(new Date(selectedEmployee.birthDate), 'dd.MM.yyyy')
                                            : '-'
                                        }
                                    </span>
                                </div>
                                <div>
                                    <strong>Email: </strong>
                                    <span>{selectedEmployee?.email ?? '-'}</span>
                                </div>
                                <div>
                                    <strong>Телефон: </strong>
                                    <span>{selectedEmployee?.phoneNumber ?? '-'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="dep-page__user-info-actions">
                            {selectedEmployee && (<UploadIcon onClick={uploadFileHandler} color="#7a7a7a" />)}
                        </div>
                    </div>
                    <div className="dep-page__user-add-info">
                        <div className="dep-page__user-add-info-files">
                            <span className="dep-page__label">
                                Прикрепленные файлы:
                            </span>
                            <FilesList 
                                onFileDownload={downloadFileHandler}
                                onFileDelete={deleteFileHandler}
                                filesList={selectedEmployee?.userFiles ?? []} 
                            />
                        </div>
                        <div className="dep-page__user-add-info-data">
                            <div className="dep-page__user-add-info-data__cell">
                                <div className="dep-page__list-title">
                                    <span className="dep-page__label">
                                        Данные об образовании:
                                    </span>
                                    {!!selectedEmployee && (
                                        <PlusIcon width={16} height={16} className="dep-page__add-btn" onClick={() => setShowEducationDialog(true)} />
                                    )}
                                </div>
                                <EducationList educationList={selectedEmployee?.educations ?? []} onDelete={(id) => {
                                    if(confirm('Вы действительно хотите удалить данную запись об образовании?')) {
                                        dispatch(deleteEducation(id));
                                    }
                                }} />
                            </div>
                            <div className="dep-page__user-add-info-data__cell">
                                <div className="dep-page__list-title">
                                    <span className="dep-page__label">
                                        Данные о работе:
                                    </span>
                                    {!!selectedEmployee && (
                                        <PlusIcon width={16} height={16} className="dep-page__add-btn" onClick={() => setShowWorkExpDialog(true)} />
                                    )}
                                </div>
                                <WorkExperienceList workExperienceList={selectedEmployee?.workExperience ?? []} onDelete={(id) => {
                                    if(confirm('Вы действительно хотите удалить данную запись о рабочем опыте?')) {
                                        dispatch(deleteWorkExperience(id));
                                    }
                                }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
