import { CategoryReadDto } from "@/models/category.model"
import { CompanyCustomerDefault } from "@/models/company-customer.model"
import { Decimal } from "@/models/decimal.model"
import { GroupedEstab } from "@/models/estab.model"
import { ConfigSistema } from "@/models/external/config-sistema.model"
import { Floor } from "@/models/floor.model"
import { Room } from "@/models/room.model"
import { Table } from "@/models/table.model"
import { TaxRate } from "@/models/tax-rate.model"
import { Tax } from "@/models/tax.model"
import { Vendedor } from "@/models/vendedor.model"

export type DataPopulatedFloorRoomTable  = {
    floors: Record<number, Floor>;
    rooms: Record<number, Room>;
    tables: Record<number, Table>
}
type DataPopulatedTax = {
    taxes: Record<string, Tax>;
    taxRates: Record<string, TaxRate>;
}
export interface DataFormPos {
    categories: Array<CategoryReadDto>
    configSistema: ConfigSistema
    customer: CompanyCustomerDefault
    dataPopulatedFloorRoomTable: DataPopulatedFloorRoomTable
    dataPopulatedTax: DataPopulatedTax
    decimal: Decimal
    establecimientos: Array<GroupedEstab> 
    vendedores: Array<Vendedor> 
}

 

export const dataFormPosInitialState: DataFormPos = {
    categories: [],
    configSistema: {
        searchCode: false,
        printerAutomatic: false,
        payAutomatic: false,
        multipleVendedor: false
    },
    customer: {
        customerCompanyId: 0,
        razonSocialComprador: "",
        nombreComercial: "",
        identificacionComprador: "",
        name: ""
    },
    dataPopulatedFloorRoomTable: {
        floors: {},
        rooms: {},
        tables: {}
    },
    dataPopulatedTax: {
        taxes: {},
        taxRates: {}
    },
    decimal: {
        nroPrecio: 2,
        nroCantidad: 2,
        nroIva: 2,
        nroDescuentoDetalle: 2,
        nroTotalDetalle: 2,
        nroTotalSubTotal: 2,
        nroDescuento: 2,
        importeTotal: 2,
        nroIce: 2
    },
    establecimientos: [],
    vendedores: []
}