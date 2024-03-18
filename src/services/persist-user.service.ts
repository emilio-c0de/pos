import { PERSIS_USER } from "@/constants/constants.ts";
import { Establecimiento } from "@/models/estab.model.ts";
import { UserRole } from "@/models/user.model.ts";

//Token 
export const setToken = (token: string) => {
    localStorage.setItem(PERSIS_USER.TOKEN, token);
}

export const getToken = () => {
    const auth_token = localStorage.getItem(PERSIS_USER.TOKEN);
    return auth_token;
}

//User
export const setUserData = (userData: UserRole) => {
    localStorage.setItem(PERSIS_USER.USER_DATA, JSON.stringify(userData))
}
export const getUserData = (): UserRole => {
    const userData = localStorage.getItem(PERSIS_USER.USER_DATA);
    return userData ? JSON.parse(userData) : {}
}

//Estabs 
export const setEstabs = (estabs: Establecimiento[]) => {
    localStorage.setItem(PERSIS_USER.ESTABS, JSON.stringify(estabs));
}

export const getEstabs = (): Establecimiento[] => {
    const estabs = localStorage.getItem(PERSIS_USER.ESTABS);
    return estabs ? JSON.parse(estabs) : []
}

export const setDataEstab = <T>(data: T) => {
    localStorage.setItem(PERSIS_USER.DATA_ESTAB, JSON.stringify(data));
}
export const getDataEstab = (): Establecimiento => {
    const dataEstab = localStorage.getItem(PERSIS_USER.DATA_ESTAB);
    if (dataEstab) {
        return JSON.parse(dataEstab)
    }
    return {} as Establecimiento
}

export const persistenceClear = () => {
    Object.keys(localStorage).forEach(function (key) {
        localStorage.removeItem(key);
    })
}