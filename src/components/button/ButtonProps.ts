/**
 * Свойства компонента "Кнопка"
 */
export interface ButtonProps {
    className?: string;
    text?: string;
    onClick?: () => void;
    type?: 'primary' | 'secondary';
}
