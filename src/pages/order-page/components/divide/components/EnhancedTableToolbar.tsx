import { EditNoteIcon, NextPlanIcon } from "@/components/common/IconsMaterial";
import { useDialog } from "@/context/DialogProvider";
import { useDivideStore } from "@/store/order/divide/divide.slice";
import { notify, ToastType } from "@/utils/toastify/toastify.util";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import ConvertToDocDialog from "./ConvertToDocDialog";
import CustomOrderItem from "./CustomOrderItem";

function EnhancedTableToolbar( ) {
    const {orderDivideItems, selected} = useDivideStore(state=>state)
    const [openDialog, closeDialog,] = useDialog(); 

    const rowCount = orderDivideItems.length;
    const numSelected = selected.length

    const isUnchangedQuantity = orderDivideItems.every(i => (i.remainingQuantity || 0) > 0 && i.quantity === (i.remainingQuantity || 0));
 

    const openCustomOrderItemDialog = () => {
        openDialog({
            maxWidth: 'md',
            children: <CustomOrderItem close={closeDialog} />
        })
    }

    const openConvertToDocDialog = () => {
        if (selected.length === 0) {
            notify({
                type: ToastType.Warning,
                content: 'Seleccione al menos un item'
            })
            return
        }
        openDialog({
            maxWidth: 'xs',
            children: <ConvertToDocDialog close={closeDialog} />
        })
    }


    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                // ...(numSelected > 0 && {
                //     bgcolor: (theme) =>
                //         alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                // }),
            }}
        >
            {numSelected > 0 ? (
                <Typography

                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {`${numSelected} ${numSelected === 1 ? 'Seleccionado' : 'Seleccionados'}`}
                </Typography>
            ) : ''}
            <Box sx={{ flexGrow: 1 }} />
            {
                numSelected > 0 ? (

                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <Stack spacing={1} direction="row">
                            {
                                rowCount === numSelected && isUnchangedQuantity && (
                                    <Button variant='contained' color='info' size='large' onClick={openCustomOrderItemDialog} >
                                        <EditNoteIcon /> Personalizado
                                    </Button>
                                )
                            }
                            <Button variant='contained' size='large' color='success' onClick={openConvertToDocDialog} >
                                <NextPlanIcon /> Continuar
                            </Button>
                            {/* <Button variant='contained' color='warning' size='large' >
                                Nota Entrega
                            </Button> */}

                        </Stack>
                    </Box>
                ) : ''
            }


            {/* {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Nutrition
                </Typography>
            )}
            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )} */}
        </Toolbar>
    );
}

export default EnhancedTableToolbar;