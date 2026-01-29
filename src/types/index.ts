export interface DashboardItem {
    id: string;
    title: string;
    count: string;
    icon: any; // Using 'any' for Icon name string for now, can be specific later
    iconLib: any; // The icon component library (Ionicons, etc.)
    color: string;
    subtext: string;
}

export interface Task {
    id: string;
    columnId: string;
    title: string;
    tag: string;
    tagColor: string;
    priority: 'high' | 'medium' | 'low';
    comments: number;
    attachments: number;
    date: string;
    assignee: string;
}

export interface Activity {
    id: string;
    title: string;
    desc: string;
    time: string;
    icon: any;
    color: string;
    iconLib: any;
}

export interface SurveyStat {
    name: string;
    count: number;
    color: string;
}
