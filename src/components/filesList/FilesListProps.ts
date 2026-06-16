import { UserFile } from '../../types/models';

export interface FilesListProps {
    filesList: Array<UserFile>;
    onFileDownload?: (displayName: string, systemName: string) => void;
    onFileDelete?: (id: number) => void;
}
