import { CATEGORY_CODE } from "@/constants/constants"

 
interface Category {
    idSubFamilia: number
    descripcion: string,
    codigo: string | CATEGORY_CODE.COM | CATEGORY_CODE.PROM
    s3ObjectUrl?: string
}

export interface CategoryReadDto extends Category { }