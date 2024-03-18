 
 

export interface ICustomer {
    readonly idCliente: number,
    nombreFiscal: string,
    nombreComercial: string,
    numeroIdentificacion: string,
    direccion: string,
    correo: string,
    idTiempoCredito: number,
    diasCredito: number,
    nombreCompleto: string,
    placa: string,
    validationSri?: string,
    tipoIdentificacion?: string,
    rucEmpresa: string
    companyId: number,
    customerId: number,
    idSubContribuyente: number
    idTipoIdentificacion: number
    telefono: string
}

//get id adapter 
export interface ICustomerReadDto {
    readonly customerCompanyId: number;
    fiscalName: string
    tradeName: string
    identificationNumber: string
    //Editar
    idTipoIdentificacion?: number
    idTiempoCredito?: number
    idSubContribuyente?: number
    correo?: string
    telefono?: string
    direccion?: string
}

//Crear Cliente 
export interface CustomerCreateDto {
    idCliente: number
    idTipoIdentificacion: number
    idTiempoCredito: number
    idSubContribuyente: number
    numeroIdentificacion: string
    nombreFiscal: string
    nombreComercial: string
    codigoSri: ''
    direccion?: string
    emails: string[]
    telefonos: string[]
    correo?: string
    telefono?: string
    placa?: string
}



export interface CustomerSearchRaw extends Pick<ICustomer, "idCliente" | "nombreComercial" | "nombreFiscal" | "numeroIdentificacion"> { }
export interface CustomerSearchDto extends Pick<ICustomerReadDto, "identificationNumber" | "fiscalName" | "tradeName" | "customerCompanyId"> {}

 
 