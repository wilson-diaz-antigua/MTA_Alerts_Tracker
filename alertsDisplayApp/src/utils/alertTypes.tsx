export interface StopData {
    stop: string[];
    alerts: Alert[];
}

export interface Alert {
    activePeriod?: DateRange[];
    heading: string;
    route?: string;
    alert_type?: string;
    direction?: string;
}

export interface DateRange {
    start: number;
    end?: number;
}

export const dates: DateRange[] = [
    {
        "start": 1742868000,
        "end": 1742877900
    },
    {
        "start": 1742954400,
        "end": 1742964300
    },
    {
        "start": 1743040800,
        "end": 1743050700
    },
    {
        "start": 1743127200,
        "end": 1743137100
    },
    {
        "start": 1743472800,
        "end": 1743482700
    },
    {
        "start": 1743559200,
        "end": 1743569100
    },
    {
        "start": 1743645600,
        "end": 1743655500
    },
];

export interface StopNameObject {
    stop_id: string;
    stop_name: string;
}

export interface ProcessedAlert {
    service: string[];
    heading: string[];
    type: string[];
}

export interface AccordionContextType {
    accordionOpen: boolean | null;
    setAccordionOpen: (open: boolean) => void;
}
