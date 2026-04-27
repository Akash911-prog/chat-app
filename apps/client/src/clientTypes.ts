// A bubble nav item (participates in the droplet effect)
export interface BubbleNavItem {
    type?: "bubble"; // default
    id: string;
    label: string;
    url: string;
    icon: React.ReactNode;
}

// A custom nav item — fully self-contained, no bubble effect
export interface CustomNavItem {
    type: "custom";
    id: string;
    render: (props: { onClose: () => void }) => React.ReactNode;
}

export type NavItem = BubbleNavItem | CustomNavItem;

export type safeUser = {
    id: string;
    username: string;
};
