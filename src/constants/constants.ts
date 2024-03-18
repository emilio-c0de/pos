const gateway = 'Gateway/'
export enum PATHS_API {
    FACT_ELECT = `${gateway}FactElect/`,
    ACCOUNT = `${gateway}Seguridad/v3/Account/login`,
    CREATE_TOKEN = `Restaurant/Account/createToken`,
    INVENTORY = `${gateway}Inventario/`,
    SALE = `${gateway}Venta/`,
    ACCOUNTING = `${gateway}Contabilidad/`,
    CONFIG = `${gateway}Config/`,
    CONSULTA = `${gateway}Consultas/`,
    REPORT = `${gateway}ReportS/`,
    PRIVATE = `${gateway}Restaurant/`,
}

export enum PATHS {
    COMPANY_CUSTOMER = 'CompanyCustomer/',
    ORDER = 'Order/',
    ITEM = 'Item/',
    CONFIG = 'Configuration/',
    PRODUCT = 'Articulo/',
    CUSTOMER = 'Cliente/',
    TABLE = 'Tables/',
    REPORT_V1 = `Reporte/`,
    REPORT_V2 = `v2/Reporte/`,
    CUENTA_POR_COBRAR = 'CuentaPorCobrar/',
    COMPROBANTE_INGRESO = 'ComprobanteIngreso/'
}


export enum SRI_IDENTIFICATION_CODE {
    RUC = "04",
    CEDULA = "05",
    PASSPORT = "06"
}

export enum IDENTIFICATION_CODE {
    RUC = "R",
    CEDULA = "C",
    PASSPORT = "P"
}


export const enum PERSIS_USER {
    USER_DATA = "user_data",
    ESTABS = "estabs",
    TOKEN = "auth_token",
    DATA_ESTAB = 'data_estab'
}



export const enum DOC_TYPE {
    FV = 'FV',
    NE = 'NE',
    OR = 'OR'
}

export const enum PaymentTypeCode {
    TAR = "TAR",
    EFE = "EFE",
    TRA = "TRA",
    CHE = "CHE",
    DOC = "DOC"
}

export enum TAX_RATE_CODE {
    ZERO_PERCENT = "0",
    TWELVE_PERCENT = "2",
    FOURTEEN_PERCENT = "3",
    NOT_SUBJECT_TO_TAX = "6",
    TAX_EXEMPT = "7",
    DIFFERENTIATED_TAX = "8",
}

export enum TAX_CODE {
    IVA = '2',
    ICE = '3',
    IRBPNR = '5'
}


export enum CATEGORY_CODE {
    COM = 'COM',
    PROM = 'PROM'
}

export enum ITEM_TYPE_CODE {
    MENU = "MENU",
    ITEM = "ITEM"
}

 
export enum CODE_REPORT {
    OR = 'RRO', //Reporte Orden
    FV = 'RF',
    NE = 'RNE'
}