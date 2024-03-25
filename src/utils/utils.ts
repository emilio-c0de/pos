import { Floor } from "@/models/floor.model";
import { Room } from "@/models/room.model";
import { Table } from "@/models/table.model";
import { TaxRate } from "@/models/tax-rate.model";
import { Tax } from "@/models/tax.model";
import { sharedSvc } from "@/services/shared.service";

import { roundNumber } from "./round-number.util";

export function formatDateShort(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

export function formatDateLong(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}


export function isNumber(valor: string): boolean {
    // Utilizamos una expresión regular para verificar si el valor es una secuencia de dígitos.
    // ^ indica el inicio de la cadena, $ indica el final de la cadena.
    // \d representa un dígito, y + indica que debe haber uno o más dígitos.
    const regex = /^\d+$/;
    return regex.test(valor);
}

export function ccyFormat(num: number, max?: number) {
    return `$${roundNumber(num, max)}`;
}

export const isValidField = <T>(field: T): T | null => {
    const invalidValues: ReadonlyArray<T | null | undefined | "" | 0> = ["", null, undefined, 0];

    return invalidValues.includes(field) ? null : field;
}

export function validateNumber(input: string | number): boolean {
    const valueString = input.toString()
    // Check if the first character is a number
    if (!isNaN(parseInt(valueString[0]))) {
        let dotFound: boolean = false;
        for (let i: number = 1; i < valueString.length; i++) {
            // Check if the current character is a dot
            if (valueString[i] === '.') {
                // If a dot has already been found, the input is invalid
                if (dotFound) {
                    return false;
                }
                dotFound = true;
            }
            // Check if the current character is neither a number nor a dot
            else if (isNaN(parseInt(valueString[i]))) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}

export function sanitizeAndEncodeURIComponent(value: string): string {
    // Remplazar caracteres especiales con espacios en blanco
    const sanitizedValue = value.replace(/[%&]/g, '');

    // Codificar el valor modificado
    const encodedValue = encodeURIComponent(sanitizedValue);

    return encodedValue;
}

export const appendScript = (scriptToAppend: string) => {
    const script = document.createElement("script");
    script.src = scriptToAppend;
    script.async = true;
    document.body.appendChild(script);
}


// rellenar datos de pisos, salas, mesas 
export const populateDataFloorRoomTable = (
    floors: Floor[],
    rooms: Room[],
    tables: Table[]
) => {

    type Data = {
        floors: Record<number, Floor>;
        rooms: Record<number, Room>;
        tables: Record<number, Table>
    }

    const data: Data = {
        floors: {},
        rooms: {},
        tables: {}
    };

    // Populate floors
    floors.forEach(floor => {
        data.floors[floor.id] = floor;
    });

    // Populate rooms
    rooms.forEach(room => {
        data.rooms[room.id] = room;
    });

    // Populate tables
    tables.forEach(table => {
        data.tables[table.id] = table;
    });

    return data;
};


export const populateDataTax = (taxes: Tax[],
    taxRates: TaxRate[]) => {
    type Data = {
        taxes: Record<string, Tax>;
        taxRates: Record<string, TaxRate>;
    }

    const data: Data = {
        taxes: {},
        taxRates: {},
    }


    // Populate taxes
    for (const tax of taxes) {
        data.taxes[tax.codigo] = tax;

    }

    // Populate taxrates
    for (const taxRate of taxRates) {
        data.taxRates[taxRate.codigo] = taxRate;

    }

    return data;

}

export const getPrinterOrder = (id: number) => {
    sharedSvc.getPrinter({
        id,
        documentoId: 0,
        tipo: 2
    })
}

export const getPrinterFactura = (id: number, documentoId: number) => {
    sharedSvc.getPrinter({
        id,
        documentoId,
        tipo: 3
    })
}
export const getPrinterNotaEntrega = (id: number, documentoId: number) => {
    sharedSvc.getPrinter({
        id,
        documentoId,
        tipo: 4
    })
}