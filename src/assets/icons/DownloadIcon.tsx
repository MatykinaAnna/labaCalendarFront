import { FC } from 'react';
import { IconProps } from '../../types/commonTypes';

export const DownloadIcon: FC<IconProps> = props => {
    const {
        className, 
        color = '#313131', 
        height = 24, 
        width = 24, 
        onClick
    } = props;

    return (
        <svg fill={color} width={width} height={height} className={className} onClick={onClick} 
            xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
            viewBox="0 0 512 512" enableBackground="new 0 0 512 512" xmlSpace="preserve"
        >
            <path d="M442.2,186.2H302.5V0h-93.1v186.2H69.8L256,418.9L442.2,186.2z M465.5,372.4v93.1H46.5v-93.1H0V512h512V372.4H465.5z"/>
        </svg>
    );
}
