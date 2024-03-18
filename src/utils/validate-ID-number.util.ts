import { isNumber } from "./utils";

export const validateIDNumberUtil = (numeroIdentificacion: string) => {

    numeroIdentificacion = numeroIdentificacion.trim();

    if (![10, 13].includes(numeroIdentificacion.length)) return;

    if (!isNumber(numeroIdentificacion)) return;

    if (numeroIdentificacion.length === 13 && numeroIdentificacion.slice(-3) !== "001") return;

    return true;
}