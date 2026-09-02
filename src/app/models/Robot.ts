import { Event } from "./Event";

export interface Robot {
    id: string;
    type: string;
    events: Event[];
}