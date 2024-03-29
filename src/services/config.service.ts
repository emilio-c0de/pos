import { categoryAdapter } from '@/adapters/category.adapter';
import { decimalAdapter } from '@/adapters/decimal.adapter';
import { PATHS, PATHS_API } from '@/constants/constants';
import { CompanyCustomerDefault } from '@/models/company-customer.model';
import { ConfigSistema } from '@/models/external/config-sistema.model';
import { groupEstabUtil } from '@/utils/group-estab.util';
import { http } from '@/utils/http';
import { populateDataFloorRoomTable, populateDataTax } from '@/utils/utils';

const getDataForm = async <T extends { codEstab: string }>(obj: T) => {
    const json = JSON.stringify(obj)
    const responseApi = await http({
        method: 'get',
        url: `${PATHS_API.PRIVATE}${PATHS.CONFIG}`,
        params: {
            json
        },
    })

    if (responseApi.data) {
        const {
            subCategorias,
            configDecimal,
            impuesto,
            tarifaImpuesto,
            bodega_Asign,
            ptoEmi_Asig,
            room,
            floor,
            customer,
            config,
            vendedores,
            tables
        } = responseApi.data;


        const establecimientos = groupEstabUtil({
            puntosEmisionEstab: ptoEmi_Asig,
            bodegasEstab: bodega_Asign,
            isGroupBodega: true,
            isGroupPuntoEmision: true
        })

        const dataPopulatedFloorRoomTable = populateDataFloorRoomTable(floor, room, tables);
        const dataPopulatedTax = populateDataTax(impuesto, tarifaImpuesto);
        const configSistema: ConfigSistema = config[0] || {}
        const decimal = configDecimal[0] || {};
        const customerDefault: CompanyCustomerDefault = customer[0] || {}


        const dataForm = {
            categories: categoryAdapter.readFrom(subCategorias || []),
            decimal: decimalAdapter.readFrom(decimal),
            establecimientos,
            dataPopulatedFloorRoomTable,
            customer: customerDefault,
            dataPopulatedTax,
            configSistema,
            vendedores,
        }
        return dataForm;
    }
}


const getMainDataEstab = async () => {
    const json = JSON.stringify({ tipo: 1 })
    const responseApi = await http({
        method: 'get',
        url: `${PATHS_API.PRIVATE}${PATHS.CONFIG}`,
        params: {
            json
        },
    })
    const { estabs, bodegas } = responseApi.data;
    const establecimientos = groupEstabUtil({
        puntosEmisionEstab: estabs,
        bodegasEstab: bodegas,
        isGroupBodega: true,
        isGroupPuntoEmision: true
    })
    return establecimientos;
}

export const configSvc = {
    getDataForm,
    getMainDataEstab
}