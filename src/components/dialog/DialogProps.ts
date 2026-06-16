import { PropsWithChildren } from 'react';

export interface DialogProps extends PropsWithChildren {
    title: string;
    className?: string;
    onCancel?: () => void;
    onSave?: () => void;
    open?: boolean;
}
