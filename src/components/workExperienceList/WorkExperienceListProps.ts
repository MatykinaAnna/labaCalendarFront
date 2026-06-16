import { WorkExperience } from '../../types/models';

export interface WorkExperienceListProps {
    workExperienceList: Array<WorkExperience>;
    onDelete?: (id: number) => void;
}
