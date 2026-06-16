import { Education } from '../../types/models';

export interface EducationListProps {
    educationList: Array<Education>;
    onDelete?: (id: number) => void;
}
