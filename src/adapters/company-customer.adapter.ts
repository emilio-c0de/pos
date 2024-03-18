import { CompanyCustomerPost, CompanyCustomerRead, CompanyCustomerSearchRead } from '@/models/company-customer.model';
import { CreditTimeSelectHtmlOnly } from '@/models/external/tiempo-credito.model';
import { TipoContribuyente } from '@/models/external/tipo-contribuyente.model';
import { TipoIdentificacion } from '@/models/external/tipo-identificacion.model';
import { isValidField } from '@/utils/utils';

type PostPut = {
    idCliente?: number
    idTiempoCredito: number
    idSubContribuyente?: number
    idTipoIdentificacion: number
    numeroIdentificacion: string
    direccion?: string,
    nombreFiscal: string
    nombreComercial: string
    correos?: string[],
    telefonos?: string[]
    validationSri?: boolean
}

class CompanyCustomerAdapter {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getAllFrom(data: any): CompanyCustomerRead {
        return {
            idCliente: data.idCliente,
            idTipoIdentificacion: data.idTipoIdentificacion,
            identificacionComprador: data.numeroIdentificacion,
            razonSocialComprador: data.nombreFiscal,
            nombreComercial: data.nombreComercial,
            direccionComprador: data.direccion,
            telefonoComprador: data.telefono,
            correo: data.correo,
            consumidorFinal: data.consumidorFinal,
            validationSri: data.validationSri,
            tipoIdentificacion: data.tipoIdentificacion,
            codTipoIdentificacion: data.codTipoIdentificacion,
            estado: data.estado,
            totalRecords: data.totalRecords
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getDataFormFrom(data: any) {
        const [
            tempTiposIdentificacion,
            tempTiposContribuyente,
            tempTiemposCredito,
            // ciudades,
            // tiposClienteProveedor,
            // empresas,
            // cargos
        ] = data;

        const tiposIdentificacion: Array<TipoIdentificacion> = tempTiposIdentificacion || [];
        const tiposContribuyente: Array<TipoContribuyente> = tempTiposContribuyente || [];
        const tiemposCredito: Array<CreditTimeSelectHtmlOnly> = tempTiemposCredito || [];

        return {
            tiposIdentificacion,
            tiposContribuyente,
            tiemposCredito

        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getIdFrom(data: any) {
        return {
            idCliente: data.idCliente,
            idTipoClienteProveedor: data.idTipoClienteProveedor,
            idTipoEntidad: data.idTipoEntidad,
            idSubContribuyente: data.idSubContribuyente,
            idTiempoCredito: data.idTiempoCredito,
            idTipoIdentificacion: data.idTipoIdentificacion,
            idCiudad: data.idCiudad,
            numeroIdentificacion: data.numeroIdentificacion,
            identificacionComprador: data.numeroIdentificacion,
            razonSocialComprador: data.nombreFiscal,
            nombreFiscal: data.nombreFiscal,
            montoCredito: data.montoCredito,
            nombreComercial: data.nombreComercial,
            direccion: data.direccion,
            telefono: data.telefono,
            correo: data.correo,
            estado: data.estado,
            idEmpleado: data.idEmpleado,
            diasCredito: data.diasCredito,
            empleado: data.empleado,
            idEmpresa: data.idEmpresa,
            idCargo: data.idCargo,
            placa: data.placa,
            validationSri: data.validationSri as boolean,
            correos: data.correo ? data.correo.split('|') : [],
            telefonos: data.telefono ? data.telefono.split('|') : [],
            placas: data.placa && data.placa.split('|') || []
        }
    }


    //To
    postPutTo<T extends PostPut | unknown>(params: T): CompanyCustomerPost {
        const data = params as PostPut
        
        let correo = '', telefono = '';
        if (data.correos) {
            correo = data.correos.join('|')
        }
        if (data.telefonos) {
            telefono = data.telefonos.join('|')
        }
        return {
            idCliente: isValidField(data.idCliente) || 0,
            idEmpleado: null,
            idTipoIdentificacion: data.idTipoIdentificacion,
            idTipoClienteProveedor: null,
            idTipoEntidad: null,
            idCiudad: null,
            idSubContribuyente: isValidField(data.idSubContribuyente),
            idTiempoCredito: data.idTiempoCredito,
            idEmpresa: null,
            idCargo: null,
            numeroIdentificacion: data.numeroIdentificacion,
            nombreFiscal: data.nombreFiscal,
            nombreComercial: data.nombreComercial,
            direccion: isValidField(data.direccion),
            telefono: isValidField(telefono),
            correo: isValidField(correo),
            placa: null,
            montoCredito: null,
            nota: null,
            validationSri: data.validationSri || false,
            estado: true
        }
    }


    searchFrom(customers: unknown): CompanyCustomerSearchRead[] {
        if (!Array.isArray(customers)) return [];

        const results: CompanyCustomerSearchRead[] = customers.map(data => {
            return {
                idCliente: data.idCliente,
                razonSocialComprador: data.nombreFiscal,
                nombreComercial: data.nombreComercial,
                identificacionComprador: data.numeroIdentificacion,
                name: data.nombreFiscal
            };
        });

        return results;
    }

}


export const companyCustomerAdapter = new CompanyCustomerAdapter();