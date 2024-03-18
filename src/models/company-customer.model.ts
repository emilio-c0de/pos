
export interface CompanyCustomer {
    idCliente: number
    idTipoIdentificacion: number
    identificacionComprador: string
    razonSocialComprador: string
    nombreComercial: string
    direccionComprador: string
    telefonoComprador: string | null,
    correo: string | null,
    consumidorFinal: false,
    validationSri: true,
    tipoIdentificacion: string
    codTipoIdentificacion: string
    estado: true,
}

export type CompanyCustomerRead = CompanyCustomer & {
    totalRecords: number
}

export type CompanyCustomerPost = {
    idCliente?: number,
    idEmpleado?: number | null
    idTipoIdentificacion: number
    idTipoClienteProveedor?: number | null
    idTipoEntidad?: number | null
    idCiudad?: number | null 
    idSubContribuyente?: number | null
    idTiempoCredito: number
    idEmpresa?: number | null
    idCargo?: number | null
    numeroIdentificacion: string
    nombreFiscal: string
    nombreComercial: string
    direccion?: string | null
    telefono?: string | null
    correo?: string | null
    placa?: string | null
    montoCredito?: number | null
    nota?: string | null
    validationSri: boolean
    estado: boolean
}

export type CompanyCustomerSearchRead = {
    idCliente: number
    razonSocialComprador: string
    nombreComercial: string
    identificacionComprador: string
    name: string
}

export type CompanyCustomerDefault = {
    customerCompanyId: number
    razonSocialComprador: string
    nombreComercial: string
    identificacionComprador: string
    name: string
}

export interface CompanyCustomerReadUpdate extends Pick<CompanyCustomer, "idCliente" | "identificacionComprador" | "razonSocialComprador"> {
    idTipoClienteProveedor: number
    idTipoEntidad: number
    idSubContribuyente: number
    idTiempoCredito: number
    idTipoIdentificacion: number
    idCiudad: number
    numeroIdentificacion: string
    nombreFiscal: string
    montoCredito: number,
    nombreComercial: string
    direccion: string
    telefono: string
    correo: string
    estado: string
    idEmpleado: number
    diasCredito: number
    empleado: string
    idEmpresa: number
    idCargo: number
    placa: string
    validationSri: boolean
    correos: Array<string>
    telefonos: Array<string>
    placas: Array<string>
}