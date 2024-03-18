import { Establecimiento } from "./estab.model"

export interface UserRole {
    userId: number
    userRoleId: number
    codeRole: string
    role: string
    username: string
    fullname: string
    email: string
    IDCardUser: string
    profilePicture: string
    tradeName: string
    bussinesName: string
    IDCardCompany: string
    companyId: number
    establecimientos: Array<Establecimiento>
    token: string
    urlGateway: string
}

export interface User {
    idUsuario: number
    nombreUsuario: string
    nombreCompleto: string
}

export interface UserSelectHtmlOnly extends User {}