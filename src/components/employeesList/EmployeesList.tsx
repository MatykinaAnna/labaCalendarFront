import { FC, useState } from 'react';
import { EmployeesListProps } from './EmployeesListProps';
import { PencilIcon, TrashIcon } from '../../assets/icons';
import './employeesListStyles.scss'
import clsx from 'classnames';

export const EmployeesList: FC<EmployeesListProps> = props => {
    const { 
        employeesList, 
        onItemClick,
        onItemDelete,
        onItemEdit
    } = props;
    const [selectedEmployee, setSelectedEmployee] = useState(0);

    const employeeClickHandler = (id: number) => {
        setSelectedEmployee(id);
        onItemClick && onItemClick(id);
    }

    const employeeEditHandler = (id: number) => {
        onItemEdit && onItemEdit(id);
    }

    const employeeDeleteHandler = (id: number) => {
        onItemDelete && onItemDelete(id);
    }

    const isSelected = (id: number) => selectedEmployee === id;

    return (
        <div className="empl-list">
            {employeesList.map(employee => {
                return (
                    <div key={employee.id} 
                        className={clsx('empl-list__item', {'empl-list__item_selected': isSelected(employee.id)})}
                        onClick={() => employeeClickHandler(employee.id)}
                    >
                        <div className="empl-list__item-fio">
                            {`${employee.lastName} ${employee.firstName} ${employee.midleName ?? ''}`.trim()}
                        </div>
                        <div className="empl-list__item_actions">
                            <PencilIcon width={18} height={18} onClick={() => {employeeEditHandler(employee.id)}} />
                            <TrashIcon width={18} height={18} onClick={() => {employeeDeleteHandler(employee.id)}} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
