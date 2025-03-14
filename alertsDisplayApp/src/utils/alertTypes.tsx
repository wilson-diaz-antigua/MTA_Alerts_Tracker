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
