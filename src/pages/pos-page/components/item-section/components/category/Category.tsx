 
import { CategoryIcon } from "@/components/common/IconsMaterial";
import { themePalette } from "@/config/theme.config";
import { CATEGORY_CODE } from "@/constants/constants";
import { usePosStore } from "@/store/pos/posStore";
import { Avatar, Box, Tab, Tabs } from "@mui/material"
import { SyntheticEvent, useState } from "react";

import CategorySkeleton from "./CategorySkeleton";
const combo_img = new URL('/images/combo.jpg', import.meta.url).href

const Category = () => { 
    const {dataFormPos, loading} = usePosStore.sharedStore((state) => state); 
    const { categories: rawCategories } = dataFormPos;
    const itemStore = usePosStore.itemStore((state) => state);
 
    const [value, setValue] = useState(0);
  
    const categories = [{
        idSubFamilia: 0,
        codigo: "",
        descripcion: 'Todos',
        s3ObjectUrl: '',
    },
    {
        idSubFamilia: 0,
        codigo: CATEGORY_CODE.COM,
        descripcion: 'COMBOS',
        s3ObjectUrl: combo_img
    },
    ...rawCategories]

    const handleChange = (_: SyntheticEvent, newValue: number) => {
        const dataCategory = categories[newValue]
        itemStore.setDataSearch({
            prop: 'idSubFamilia',
            value: dataCategory.idSubFamilia,
            codigo: dataCategory.codigo
        })

        setValue(newValue);
    }

    if (loading) {
        return <CategorySkeleton/>
    }

    return (
        <Box
            sx={{
                flexGrow: 1,
                bgcolor: 'background.paper',
                borderRadius: 5,
            }}
        >
            <Tabs value={value} onChange={handleChange} variant="scrollable"
                scrollButtons aria-label="icon label tabs example" sx={{ borderRadius: 5 }}>
                {
                    categories.map((category, index) => (
                        <Tab key={index}
                            icon={<Avatar sx={{ bgcolor: themePalette.PINK }} alt={category.descripcion} src={category.s3ObjectUrl}
                            > <CategoryIcon /></Avatar>}
                            label={category.descripcion} wrapped />
                    ))
                }
            </Tabs>
        </Box>
    )
}

export default Category