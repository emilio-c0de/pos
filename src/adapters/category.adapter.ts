import { CategoryReadDto } from "@/models/category.model";



function readFrom(categories: CategoryReadDto[]): Array<CategoryReadDto> {
    return categories.map((category) => ({
        idSubFamilia: category.idSubFamilia,
        descripcion: category.descripcion,
        codigo: category.codigo,
        s3ObjectUrl: category.s3ObjectUrl
    })
    )
} 

export const categoryAdapter = {
    readFrom
}