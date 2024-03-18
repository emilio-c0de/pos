import PaginationCustom from '@/components/common/PaginationCustom';
import CompanyCustomerAddEditDialog from '@/components/company-customer/CompanyCustomerAddEditDialog';
import PrimaryStatusTable from '@/components/ui/PrimaryStatusTable'
import { StyledTableCell } from '@/components/ui/StyledTableCell';
import { useDialog } from '@/context/DialogProvider';
import { isApiResponse } from '@/models/api-response';
import { CompanyCustomerRead } from '@/models/company-customer.model'
import { companyCustomerSvc } from '@/services/external/company-customer.service'
import { hideLoader, showLoader } from '@/utils/loader'
import { notify, ToastType } from '@/utils/toastify/toastify.util';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import ModeTwoToneIcon from '@mui/icons-material/ModeTwoTone';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { Button, Card, CardContent, FormControl, Grid, IconButton, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import Swal from 'sweetalert2';

const CustomerCompanyPage = () => {
    const [openDialog, closeDialog] = useDialog();

    const [companyCustomers, setCompanyCustomers] = useState<Array<CompanyCustomerRead>>([]);
    const [dataSearch, setDataSearch] = useState({
        textSearch: '',
        pageIndex: 1,
        pageSize: 25
    })
    const pageSizeOptions = [25, 50, 75, 100];

    const openAddEditDialog = (id?: number) => {
        openDialog({
            maxWidth: 'sm',
            children: <CompanyCustomerAddEditDialog id={id} closeDialog={callbackCloseDialog} />
        })
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const callbackCloseDialog = (data: any) => {
        if (data !== null && typeof data === 'object') {
            getCompanyCustomers();
        }
        closeDialog();
    }

    const setPageIndex = (pageIndex: number) => {
        setDataSearch({
            ...dataSearch,
            pageIndex: pageIndex,
        })
    }
    const setPageSize = (pageSize: number) => {
        setDataSearch({
            ...dataSearch,
            pageSize: pageSize,
            pageIndex: 1,
        })
    }

    const getCompanyCustomers = () => {
        try {
            const params = {
                pageIndex: dataSearch.pageIndex,
                pageSize: dataSearch.pageSize,
                textSearch: dataSearch.textSearch
            }
            showLoader();
            companyCustomerSvc.getAll(params).then(response => {
                setCompanyCustomers(response);
            }).catch(error => {
                console.log(error)
            }).finally(() => hideLoader());
        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }
    useEffect(() => {
        getCompanyCustomers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataSearch])

    const onChaneTextSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue: string = (event.target as HTMLInputElement).value;
        setDataSearch((e) => ({
            ...e,
            pageIndex: 1,
            textSearch: inputValue
        }))
    }
    const refresh = function () {
        getCompanyCustomers();
    }

    const askToDelete = async (id: number) => {
        try {
            const { isConfirmed } = await Swal.fire({
                html: `<small>Esta Ud. seguro de Inactivar al Cliente</small>?`,
                icon: 'warning',
                showConfirmButton: true,
                confirmButtonText: 'Sí!',
                showCancelButton: true,
                cancelButtonText: 'No!',
                allowOutsideClick: false,
            })


            if (isConfirmed) {
                showLoader();
                companyCustomerSvc.delete(id).then(response => {
                    if (isApiResponse(response)) {
                        if (response.code === "0") {
                            notify({
                                type: ToastType.Warning,
                                content: response.message
                            })
                        }
                        if (response.code === "1") {
                            notify({
                                type: ToastType.Success,
                                content: response.message
                            })
                            getCompanyCustomers();
                        }
                    }
                }).catch(error => {
                    console.log(error)
                }).finally(() => hideLoader());
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Card>
            <CardContent>
                <Grid container>
                    <Grid container >
                        <Grid item xs={5} alignSelf="center">
                            <Typography variant="h6" display="block" gutterBottom >
                                Clientes
                            </Typography>
                        </Grid>
                        <Grid item xs={7} alignSelf="center" textAlign="end">
                            <Button color="info" variant="contained" onClick={() => openAddEditDialog()} >
                                Nuevo
                            </Button>
                        </Grid>
                    </Grid>

                    <Grid container justifyContent="space-between" m={1}>
                        <Grid item xs={5} alignSelf="center">
                            <FormControl sx={{ minWidth: 50 }} size="small">
                                <Select
                                    labelId="pageSizeOptions"
                                    value={dataSearch.pageSize}
                                    onChange={(e) => setPageSize(Number(e.target.value))}
                                >
                                    {
                                        pageSizeOptions.map((size, index) => (
                                            <MenuItem key={index} value={size}>{size}</MenuItem>

                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <Stack direction="row" spacing={1}>
                                <TextField margin='normal'
                                    label="Buscar Cliente"
                                    name='textSearch'
                                    size="small"
                                    autoComplete='off'
                                    onChange={onChaneTextSearch}
                                />

                                <IconButton color='primary' onClick={refresh}>
                                    <FilterAltOffIcon />
                                </IconButton>

                            </Stack>
                        </Grid>
                    </Grid>


                    <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 400 }}>
                        <Table stickyHeader size="small">
                            <TableHead >
                                <TableRow>
                                    <StyledTableCell>Op.</StyledTableCell>
                                    <StyledTableCell>N°</StyledTableCell>
                                    <StyledTableCell>Cedula/RUC</StyledTableCell>
                                    <StyledTableCell>Nombre Fiscal</StyledTableCell>
                                    <StyledTableCell>Dirección</StyledTableCell>
                                    <StyledTableCell>Correo</StyledTableCell>
                                    <StyledTableCell>Teléfono</StyledTableCell>
                                    <StyledTableCell>Estado</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    companyCustomers.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Stack direction="row">
                                                    <IconButton color="primary" aria-label="edit customer" onClick={() => openAddEditDialog(item.idCliente)}>
                                                        <ModeTwoToneIcon />
                                                    </IconButton>
                                                    <IconButton color="error" aria-label="delete customer" onClick={() => askToDelete(item.idCliente)}>
                                                        <PersonOffIcon />
                                                    </IconButton>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.identificacionComprador}</TableCell>
                                            <TableCell>{item.razonSocialComprador}</TableCell>
                                            <TableCell>{item.direccionComprador}</TableCell>
                                            <TableCell>{item.correo && item.correo.replace(';', '\n')}</TableCell>
                                            <TableCell>{item.telefonoComprador}</TableCell>
                                            <TableCell>
                                                <PrimaryStatusTable status={item.estado} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                                {
                                    companyCustomers.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={8} align='center'>
                                                No hay datos
                                            </TableCell>
                                        </TableRow>
                                    )
                                }

                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Grid mt={3}>
                        <PaginationCustom
                            items={companyCustomers}
                            totalRecords={companyCustomers.length > 0 ? companyCustomers[0].totalRecords : 0}
                            pageSize={dataSearch.pageSize}
                            setPageIndex={setPageIndex}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default CustomerCompanyPage