import { FC } from 'react';
import { TrashIcon } from '../../assets/icons';
import { WorkExperienceListProps } from './WorkExperienceListProps';
import './workExperienceListStyles.scss'

export const WorkExperienceList: FC<WorkExperienceListProps> = props => {
    const {
        workExperienceList,
        onDelete
    } = props;

    const deleteHandler = (id: number) => {
        onDelete && onDelete(id);
    }

    return (
        <div className="work-exp-list">
            {workExperienceList.map(workExp => {
                return (
                    <div key={workExp.id} className="work-exp-list__item">
                        <div className="work-exp-list__item-descr">
                            <span>{workExp.description}</span>
                            <span className="work-exp-list__item-descr-years">
                                Лет: {workExp.workedYears}
                            </span>
                        </div>
                        <div className="work-exp-list__item-actions">
                            <TrashIcon width={16} height={16} onClick={() => {deleteHandler(workExp.id)}} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
