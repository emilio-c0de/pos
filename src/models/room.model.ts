import { GroupedTable } from "./table.model";

 

 
export interface Room {
    id: number;
    code: string;
    description: string;
    capacity: number;
    floorId: number;
}

export interface GroupedRoom extends Room {
    tables: GroupedTable[];
}
