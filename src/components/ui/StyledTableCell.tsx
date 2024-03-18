import { themePalette } from "@/config/theme.config";
import { TableCell, styled, tableCellClasses } from "@mui/material"; 

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: themePalette.PINK,
        color: theme.palette.common.white,
        fontWeight: 700
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));