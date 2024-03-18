import PaginationCustom from "@/components/common/PaginationCustom"
import { Stack } from "@mui/material"

const ItemSectionFooter = () => {
    return (
        <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
        >
            <PaginationCustom items={[]} pageSize={5} totalRecords={4} setPageIndex={() => { }} />

        </Stack>
    )
}

export default ItemSectionFooter