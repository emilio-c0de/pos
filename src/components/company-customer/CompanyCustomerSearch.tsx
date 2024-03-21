import { useDialog } from '@/context/DialogProvider'
import { CompanyCustomer, CompanyCustomerSearchRead } from '@/models/company-customer.model'
import { companyCustomerSvc } from '@/services/external/company-customer.service'
import { checkClientSRIByCedula, checkClientSRIByRUC } from '@/services/external/customer-SRI.service'
import { hideLoader, showLoader } from '@/utils/loader'
import { notify, ToastType } from '@/utils/toastify/toastify.util'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'

import HtmlTooltip from '../common/HtmlTooltip'
import { EditIcon, InfoIcon, PersonAddAltTwoToneIcon } from '../common/IconsMaterial'
import CompanyCustomerAddEditDialog from './CompanyCustomerAddEditDialog'
import { CompanyCustomerInfo } from './CompanyCustomerInfo'

type CompanyCustomerSearchProps = {
    customerName?: string
    basic?: boolean
    advanced?: boolean
    searchToSri?: boolean
    size?: "small" | "medium"
    callbackfn?: <T>(data: Partial<T> | null) => void
    id?: number

}
const CompanyCustomerSearch = (props: CompanyCustomerSearchProps) => {
    const [openDialog, closeDialog] = useDialog();

    const { advanced, basic, size, callbackfn, id, customerName } = props;

    const [value, setValue] = useState(customerName || '')
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState<Array<CompanyCustomerSearchRead>>([]);
     
    const dataCustomerSRI = useRef<Partial<CompanyCustomer>>({
        identificacionComprador: '',
        razonSocialComprador: '',
        nombreComercial: '',
        direccionComprador: "",
        telefonoComprador: "",
        correo: "",
    })

    const companyCustomerId = useRef(0);
    const [openTooltip, setOpenTooltip] = useState(false)

    const controllerRef = useRef<AbortController>();

    const request = async (newValue: string) => {
        try {

            companyCustomerId.current = 0;
            setCustomers(() => []);

            if (controllerRef.current) {
                controllerRef.current.abort();
            }

            controllerRef.current = new AbortController();
            const signal = controllerRef.current.signal;
            setLoading(() => true)
            companyCustomerSvc.search({ textSearch: newValue }, signal).then(response => {
                setLoading(() => false)
                setCustomers(response)
            }).catch(error => {
                console.log(error.message)
            })
        } catch (error) {
            console.log(error)
        }
    }


    const onInputChange = (newValue: string) => request(newValue);


    useEffect(() => {
        return () => {
            if (controllerRef.current) {
                controllerRef.current.abort();
            }
        }
    }, []);

    const onChange = (data: unknown) => {
        if (callbackfn) {
            if (data && (data as CompanyCustomerSearchRead).idCliente > 0) {
                callbackfn(data);
                companyCustomerId.current = (data as CompanyCustomerSearchRead).idCliente;
                console.log(companyCustomerId)
            } else {
                callbackfn(null);
            }
        }
    }

    const setDataSriEmpty = (textSearch?: string) => {
        dataCustomerSRI.current = {
            identificacionComprador: textSearch,
            razonSocialComprador: "",
            direccionComprador: "",
            telefonoComprador: "",
            correo: ""
        }
    }

    const openAddDialog = () => {
        openDialog({
            maxWidth: 'sm',
            children: <CompanyCustomerAddEditDialog closeDialog={closeDialog} dataCustomerSRI={dataCustomerSRI.current} />
        })
    }

    const onClickNewButton = () => {
        const elem = document.getElementById('customerSearch') as HTMLInputElement;
        const textSearch = elem.value;

       // companyCustomerId.current = 0;
        setDataSriEmpty();
        if (textSearch) {
            onSearchToSRI(textSearch)
            return
        }
      //  openAddDialog();
        openDialog({
            maxWidth: 'sm',
            children: <CompanyCustomerAddEditDialog closeDialog={closeDialog}   />
        })


    }

    const openEditDialog = () => {
        const id = companyCustomerId.current;
        openDialog({
            maxWidth: 'sm',
            children: <CompanyCustomerAddEditDialog id={id} closeDialog={closeDialog} />
        })
    }


    const showAlertConfirmID = (textSearch: string) => {
        Swal.fire({
            //title: "Are you sure?",
            html: `Desea registrar este numero de identificacion: ${textSearch} como <b>PASAPORTE</b>?`,
            icon: "warning",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí!",
            cancelButtonText: 'No!'
        }).then(result => {
            if (result.isConfirmed) {
                setDataSriEmpty(textSearch);
                openAddDialog()
            }
        })
    }

    function verificarNumero<T extends string | number>(numero: T): boolean {
        const value = numero ? numero.toString().trim() : "";

        if (![10, 13].includes(value.length)) return false;

        if (isNaN(Number(value))) return false;

        if (value.length === 13 && value.toString().slice(-3) !== "001") return false;

        return true;
    }


    const onSearchToSRI = async function (textSearch: string) {
        try {
            if (!(id && typeof id === 'number' && id > 0)) {
                const isValidID = verificarNumero(textSearch);
                if (!isValidID) {
                    showAlertConfirmID(textSearch)
                    return
                }

                showLoader();
                //verifica si existe cliente registrado con el numero de identificaccion ingresada
                const response = await companyCustomerSvc.getByICard({
                    textSearch: textSearch.trim()
                }).finally(() => hideLoader())

                if (response.idCliente && response.idCliente > 0) {
                    if (callbackfn) {
                        callbackfn(response)
                    }
                    return
                }


                //Numero de RUC 
                if (textSearch.length === 13) {
                    try {
                        showLoader();
                        checkClientSRIByRUC(textSearch).then(response => {
                            const { numeroRuc, razonSocial, direccion, telefono, email, error } = response;
                            if (!numeroRuc) {
                                notify({
                                    type: ToastType.Info,
                                    content: error as string
                                })
                                return
                            }
                            dataCustomerSRI.current = {
                                identificacionComprador: numeroRuc,
                                razonSocialComprador: razonSocial,
                                nombreComercial: razonSocial,
                                direccionComprador: direccion,
                                telefonoComprador: telefono,
                                correo: email,
                            }
                            openAddDialog()
                        })
                            .catch(error => {
                                console.log(error)
                            })
                            .finally(() => {
                                hideLoader();
                            })
                    } catch (error) {
                        console.log(error);
                        hideLoader();
                    }
                }

                //Numero de Cedula 
                if (textSearch.length === 10) {
                    try {
                        showLoader();
                        checkClientSRIByCedula(textSearch).then(response => {
                            const { identificacion, nombreCompleto, direccion, telefono, email, error } = response;
                            if (!identificacion || !nombreCompleto) {
                                notify({
                                    type: ToastType.Info,
                                    content: error as string
                                })
                                return
                            }
                            dataCustomerSRI.current = {
                                identificacionComprador: identificacion,
                                razonSocialComprador: nombreCompleto,
                                direccionComprador: direccion,
                                telefonoComprador: telefono,
                                correo: email
                            }
                            openAddDialog()

                        }).finally(() => {
                            hideLoader();
                        })
                    } catch (error) {
                        console.log(error);
                        hideLoader();
                    }
                }
            }

            openDialog({
                maxWidth: 'sm',
                children: <CompanyCustomerAddEditDialog closeDialog={closeDialog} />
            })
        } catch (error) {
            console.log(error)
        }
    }

    const onEnterCustomerSearch = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const textSearch = (event.target as HTMLInputElement)?.value;
        setDataSriEmpty();

        if (event.key === 'Enter' && textSearch) {
            event.stopPropagation();
            onSearchToSRI(textSearch)
        }

    }

    const renderEndAdornment = () => (
        <Stack direction="row"
            justifyContent="center"
            gap={1}
            alignItems="flex-end">
            {/* {params.InputProps.endAdornment} */}
            <Tooltip title="Nuevo Cliente">
                <PersonAddAltTwoToneIcon fontSize='medium' color='success' onClick={() => onClickNewButton()} sx={{ cursor: 'pointer' }} />
            </Tooltip>

            {
                companyCustomerId.current > 0 && (
                    <>
                        <Tooltip title="Editar Cliente">
                            <EditIcon color='primary' fontSize='medium' onClick={() => openEditDialog()} sx={{ cursor: 'pointer' }} />
                        </Tooltip>

                        <HtmlTooltip open={openTooltip} onClick={() => setOpenTooltip((state) => !state)} placement="bottom-start" title={
                            <CompanyCustomerInfo id={companyCustomerId.current} />
                        }>
                            <InfoIcon color='info' fontSize='medium' sx={{ cursor: 'pointer' }} />

                        </HtmlTooltip>
                    </>
                )
            }

        </Stack>
    )



    if (basic) {
        return (
            <Autocomplete
                onInputChange={(_, newValue) => onInputChange(newValue)}
                id="customerSearchFilter"
                options={customers}
                fullWidth
                freeSolo
                blurOnSelect
                size={size && size || 'small'}
                value={value}
                loading={loading}
                autoHighlight
                getOptionLabel={(option) => {
                    if (typeof option === 'string') {
                        return option;
                    }
                    return `${option.name}`
                }}
                onChange={(_e, value) => {
                    if (callbackfn) {
                        onChange(value)
                    }
                }}
                isOptionEqualToValue={(option, value) => option.idCliente === value.idCliente}
                renderOption={(props, option) => (
                    <li {...props}>
                        <Box
                            sx={{
                                flexGrow: 1,
                            }}
                        >
                            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                {option.identificacionComprador}
                            </Typography>
                            <Typography variant="subtitle2" gutterBottom>
                                {option.name}
                            </Typography>
                        </Box>
                    </li>
                )}
                renderInput={(params) => <TextField  {...params} label="Cliente" />}
            />
        )
    }

    if (advanced) {
        return (
            <>
                <Autocomplete
                    value={value}
                    onInputChange={(_, newValue) => onInputChange(newValue)}
                    onChange={(_e, value) => {
                        if (callbackfn) {
                            if(typeof value==='string'){
                                setValue(value)
                            }
                            onChange(value)
                        }
                    }}
                    selectOnFocus
                    // clearOnBlur
                    // handleHomeEndKeys
                    id="customerSearch"
                    options={customers}
                    autoHighlight
                    getOptionLabel={(option) => {
                        if (typeof option === 'string') {
                            return option;
                        }
                        return ` ${option.name}`
                    }}
                    loading={loading}
                    onKeyDown={onEnterCustomerSearch}
                    renderOption={(props, option) => (
                        <li {...props}>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                    {option.identificacionComprador}
                                </Typography>
                                <Typography variant="subtitle2" gutterBottom>
                                    {option.name}
                                </Typography>
                            </Box>
                        </li>
                    )}
                    freeSolo
                    fullWidth

                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size='small'
                            label="Buscar cliente"
                            InputProps={{
                                ...params.InputProps,
                                type: "text",
                                endAdornment: renderEndAdornment(),
                                style: {
                                    paddingRight: 12
                                }
                            }}
                        />
                    )}
                />

            </>
        )
    }
    return (
        <div>Not found</div>
    )
}

export default CompanyCustomerSearch