import { GroupedRoom } from "./room.model.ts";



export interface Floor {
    id: number;
    capacity: number;
    code: string;
    description: string;
}



export interface GroupedFloor extends Floor {
    rooms: GroupedRoom[];
}