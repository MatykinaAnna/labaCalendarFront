export interface MenuItem {
    id: string;
    label: string;
    action: () => void;
}

export interface UserMenuProps {
    items: Array<MenuItem>
}
