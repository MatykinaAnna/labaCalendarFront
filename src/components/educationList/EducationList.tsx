import { FC } from 'react';
import { TrashIcon } from '../../assets/icons';
import { EducationListProps } from './EducationListProps';
import './educationListStyles.scss'

export const EducationList: FC<EducationListProps> = props => {
    const {
        educationList,
        onDelete
    } = props;

    const deleteHandler = (id: number) => {
        onDelete && onDelete(id);
    }

    return (
        <div className="education-list">
            {educationList.map(education => {
                return (
                    <div key={education.id} className="education-list__item">
                        <div className="education-list__item-descr">
                            <span className="education-list__item-descr-title">
                                {education.title}
                            </span>
                            <span className="education-list__item-descr-description">
                                {education.description}
                            </span>
                        </div>
                        <div className="education-list__item-actions">
                            <TrashIcon width={16} height={16} onClick={() => {deleteHandler(education.id)}} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
