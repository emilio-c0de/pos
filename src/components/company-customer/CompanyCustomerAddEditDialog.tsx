import { companyCustomerAdapter } from '@/adapters/company-customer.adapter';
import { SRI_IDENTIFICATION_CODE } from '@/constants/constants';
import { ApiResponse } from '@/models/api-response';
import { CompanyCustomer } from '@/models/company-customer.model';
import { CreditTimeSelectHtmlOnly } from '@/models/external/tiempo-credito.model';
import { TipoContribuyente } from '@/models/external/tipo-contribuyente.model';
import { TipoIdentificacion } from '@/models/external/tipo-identificacion.model';
import { companyCustomerSvc } from '@/services/external/company-customer.service';
import { checkClientSRIByCedula, checkClientSRIByRUC } from '@/services/external/customer-SRI.service';
import { hideLoader, showLoader } from '@/utils/loader';
import { notify, ToastType } from '@/utils/toastify/toastify.util';
import { validateIDNumberUtil } from '@/utils/validate-ID-number.util';
import { Box, Button, DialogActions, DialogContent, FormControlLabel, Grid, MenuItem, Switch, Tab, Tabs, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { MuiChipsInput, MuiChipsInputChip } from 'mui-chips-input';
import { SyntheticEvent, useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import * as yup from 'yup';

import DialogHeader from '../ui/DialogHeader';

type Props = {
    id?: number
    closeDialog<T>(data?: T): void
    dataCustomerSRI?: Partial<CompanyCustomer>
}
const CompanyCustomerAddEditDialog = ({ closeDialog, id, dataCustomerSRI }: Props) => {
    const [tiposIdentificacion, setTiposIdentificacion] = useState<Array<TipoIdentificacion>>([])
    const [tiposContribuyentes, setTiposContribuyente] = useState<Array<TipoContribuyente>>([])
    const [tiemposCredito, setTiemposCredito] = useState<Array<CreditTimeSelectHtmlOnly>>([])
    console.log(tiposContribuyentes, tiemposCredito)
    const [value, setValue] = useState('one');
    const [isSearchSRI, setIsSearchSRI] = useState(true);
    const texFieldSize = "small"

    const handleChange = (_: SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };



    const getDataForm = () => {
        try {
            let idTipoIdentificacion = 0, idSubContribuyente = 0, idTiempoCredito = 0;
            showLoader();
            companyCustomerSvc.getDataForm().then(async response => {
                if (!response) return

                setTiposIdentificacion(() => response.tiposIdentificacion);
                setTiposContribuyente(() => response.tiposContribuyente);
                setTiemposCredito(() => response.tiemposCredito);

                if (typeof dataCustomerSRI === 'object' && dataCustomerSRI.identificacionComprador) {
                    const {
                        identificacionComprador,
                        razonSocialComprador,
                        direccionComprador,
                        telefonoComprador,
                        correo
                    } = dataCustomerSRI;

                    if (identificacionComprador.length == 13) {
                        const dataID = response.tiposIdentificacion.find(obj => obj.codigoSri === SRI_IDENTIFICATION_CODE.RUC);
                        if (dataID) {
                            idTipoIdentificacion = dataID.idTipoIdentificacion;
                        }
                    }
                    if (identificacionComprador.length === 10) {
                        const dataID = response.tiposIdentificacion.find(obj => obj.codigoSri === SRI_IDENTIFICATION_CODE.CEDULA);
                        if (dataID) {
                            idTipoIdentificacion = dataID.idTipoIdentificacion;
                        }
                    }

                    if (![13, 10].includes(identificacionComprador.length)) {
                        const dataID = response.tiposIdentificacion.find(obj => obj.codigoSri === SRI_IDENTIFICATION_CODE.PASSPORT);
                        if (dataID) {
                            idTipoIdentificacion = dataID.idTipoIdentificacion;
                        }
                    }

                    if (response.tiposContribuyente.length > 0) {
                        idSubContribuyente = response.tiposContribuyente.find(obj => obj.codigo === "04")?.idSubContribuyente || 0;
                    }

                    formik.setValues(state => {
                        return {
                            ...state,
                            direccion: direccionComprador,
                            idCliente: 0,
                            idSubContribuyente: idSubContribuyente,
                            idTipoIdentificacion: idTipoIdentificacion,
                            numeroIdentificacion: identificacionComprador,
                            nombreFiscal: razonSocialComprador || "",
                            nombreComercial: razonSocialComprador || "",
                            emails: correo ? correo.split('|') : [],
                            telefonos: telefonoComprador ? telefonoComprador.split('|') : [],
                        }
                    })
                    return
                }



                if (!id) {
                    if (response.tiposIdentificacion.length > 0) {
                        idTipoIdentificacion = response.tiposIdentificacion.find(obj => obj.codigoSri === SRI_IDENTIFICATION_CODE.RUC)?.idTipoIdentificacion || 0;
                    }
                    if (response.tiposContribuyente.length > 0) {
                        idSubContribuyente = response.tiposContribuyente.find(obj => obj.codigo === "04")?.idSubContribuyente || 0;
                    }

                    if (response.tiemposCredito.length > 0) {
                        idTiempoCredito = response.tiemposCredito[0]?.idTiempoCredito || 0;
                    }

                }


                if (id) {


                    await companyCustomerSvc.getId(id).then(dataCustomer => {
                        if (dataCustomer) {
                            if (response.tiemposCredito.length > 0 && !(dataCustomer.idTiempoCredito > 0)) {
                                idTiempoCredito = response.tiemposCredito[0]?.idTiempoCredito || 0;
                            } else {
                                idTiempoCredito = dataCustomer.idTiempoCredito
                            }
                            formik.setValues(state => ({
                                ...state,
                                idCliente: dataCustomer.idCliente,
                                idTiempoCredito: idTiempoCredito,
                                idTipoIdentificacion: dataCustomer?.idTipoIdentificacion || 0,
                                numeroIdentificacion: dataCustomer?.numeroIdentificacion,
                                nombreFiscal: dataCustomer?.nombreFiscal,
                                nombreComercial: dataCustomer?.nombreComercial,
                                direccion: dataCustomer?.direccion,
                                correos: dataCustomer?.correos,
                                telefonos: dataCustomer?.telefonos,
                                validationSri: dataCustomer?.validationSri,
                                idSubContribuyente: dataCustomer?.idSubContribuyente
                            }))
                        }
                    })
                } else {
                    formik.setValues(state => ({
                        ...state,
                        idTipoIdentificacion: idTipoIdentificacion,
                        idSubContribuyente: idSubContribuyente,
                        idTiempoCredito: idTiempoCredito

                    }))
                }

            }).catch(error => console.log(error))
                .finally(() => hideLoader());
        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }

    useEffect(() => {
        getDataForm();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const companyCustomerSchema = yup.object({
        idCliente: yup.number(),
        idTiempoCredito: yup.number().required("Seleccione el tiempo credito"),
        idSubContribuyente: yup.number(),
        idTipoIdentificacion: yup.number().required("Seleccione el Tipo Identificación"),
        numeroIdentificacion: yup
            .string()
            .required("Ingrese Número de Identificación")
            .test("numeroIdentificacionValido", "Número de Identificación no válido", (numeroIdentificacion, Schema) => {
                const dataIdentification = tiposIdentificacion.find(
                    obj => obj.idTipoIdentificacion === Schema.parent.idTipoIdentificacion
                )

                if (dataIdentification?.codigoSri === SRI_IDENTIFICATION_CODE.RUC) {

                    if (numeroIdentificacion.length !== 13) return false;
                    if (numeroIdentificacion.slice(numeroIdentificacion.length - 3) !== '001') return false;
                }

                if (dataIdentification?.codigoSri === SRI_IDENTIFICATION_CODE.CEDULA) {
                    if (numeroIdentificacion.length !== 10) return false;
                }
                return true; // No se aplica validación si idTipoIdentificacion es 10
            }),
        direccion: yup.string(),
        nombreFiscal: yup.string().required("Ingrese el Nombre Fiscal"),
        nombreComercial: yup.string().required("Ingrese el Nombre Fiscal"),
        correos: yup.array().default([]),
        telefonos: yup.array().default([]),
        validationSri: yup.boolean()
    });

    const parsedUser = companyCustomerSchema.cast({
        idCliente: 0,
        idTiempoCredito: 0,
        idTipoIdentificacion: 0,
        numeroIdentificacion: '',
        direccion: '',
        nombreFiscal: '',
        nombreComercial: '',
        correos: [],
        telefonos: []
    })

    const successResponse = async (response: ApiResponse) => {

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
            const customerCompanyId = (id && id > 0) ? id : response.payload as number;
            // const customerData = await customerSvc.getId(customerCompanyId);
            // handleClose(customerData);
            closeDialog({
                customerCompanyId
            })
        }
    }

    const formik = useFormik({
        initialValues: parsedUser,
        validationSchema: companyCustomerSchema,
        onSubmit: (values) => {
            if (!values.validationSri && !isSearchSRI) {
                Swal.fire({
                    //title: "Are you sure?",
                    text: "Revise que el número de identificación ingresada sea correcta!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Continuar!",
                    cancelButtonText: 'Cancelar!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        saveUpdate(values);
                    }
                });
                return
            }
            saveUpdate(values);

        },
    })

    function saveUpdate(values: unknown) {
        const params = companyCustomerAdapter.postPutTo(values);
        if (id === null || id === undefined || id === 0) {
            showLoader();
            companyCustomerSvc.post(params)
                .then(successResponse)
                .finally(() => hideLoader())
        }
        if (id) {
            showLoader();
            companyCustomerSvc.put(id, params)
                .then(successResponse)
                .finally(() => hideLoader())
        }
    }

    const getDataTipoIdentificacion = () => tiposIdentificacion.find(
        obj => obj.idTipoIdentificacion === formik.values.idTipoIdentificacion
    )
    const executeSearchCustomerSRI = (numeroIdentificacion: string) => {
        formik.setValues({
            ...formik.values,
            validationSri: false
        })
        //Si es RUC 
        if (numeroIdentificacion.length === 13 && getDataTipoIdentificacion()?.codigoSri === SRI_IDENTIFICATION_CODE.RUC) {

            //Buscar SRI 
            showLoader();
            checkClientSRIByRUC(numeroIdentificacion).then(response => {
                const { numeroRuc, razonSocial, direccion, telefono, email, error } = response;
                if (!numeroRuc) {
                    notify({
                        type: ToastType.Error,
                        content: error as string
                    })
                    return
                }

                formik.setValues({
                    ...formik.values,
                    numeroIdentificacion,
                    idCliente: 0,
                    nombreComercial: razonSocial,
                    nombreFiscal: razonSocial,
                    direccion,
                    correos: email && email.split(';') || [],
                    telefonos: telefono && telefono.split(';') || [],
                    validationSri: true
                })
            }).finally(() => hideLoader())
            return
        }

        //Si es Cedula 
        if (
            numeroIdentificacion.length === 10 && getDataTipoIdentificacion()?.codigoSri === SRI_IDENTIFICATION_CODE.CEDULA
        ) {
            //Buscar SRI 
            showLoader();
            checkClientSRIByCedula(numeroIdentificacion).then(response => {


                const { direccion, email, error, nombreCompleto, telefono } = response;
                if (response.nombreCompleto) {
                    notify({
                        type: ToastType.Error,
                        content: error as string
                    })
                    return
                }
                formik.setValues({
                    ...formik.values,
                    numeroIdentificacion,
                    idCliente: 0,
                    nombreComercial: nombreCompleto,
                    nombreFiscal: nombreCompleto,
                    direccion,
                    correos: email && email.split(';') || [],
                    telefonos: telefono && telefono.split(';') || [],
                    validationSri: true
                })

            }).finally(() => hideLoader())
        }
    }


    const customerSearchSRI = async (numeroIdentificacion: string) => {
        formik.setFieldValue("numeroIdentificacion", numeroIdentificacion)
        const dataIdentification = getDataTipoIdentificacion();

        if (validateIDNumberUtil(numeroIdentificacion)) {
            const isRuc = dataIdentification?.codigoSri === SRI_IDENTIFICATION_CODE.RUC && numeroIdentificacion.length === 13;
            const isCedula = dataIdentification?.codigoSri === SRI_IDENTIFICATION_CODE.CEDULA && numeroIdentificacion.length === 10;

            // Validación para RUC (13 dígitos)
            if (isRuc && numeroIdentificacion.length === 13) {
                await handleCustomerSearch(isSearchSRI, numeroIdentificacion);
            }

            // Validación para Cédula (10 dígitos)
            if (isCedula && numeroIdentificacion.length === 10) {
                await handleCustomerSearch(isSearchSRI, numeroIdentificacion);
            }
        }
    }

    const handleCustomerSearch = async (isSearchSRI: boolean, numeroIdentificacion: string) => {
        const isCustomerRegistered = await companyCustomerSvc.isCustomerRegistered({
            textSearch: numeroIdentificacion
        });

        if (!isCustomerRegistered && isSearchSRI) {
            executeSearchCustomerSRI(numeroIdentificacion);
        }
    }

    const handleEmailChange = (newValue: MuiChipsInputChip[]) => {
        formik.setFieldValue("correos", newValue)
    }
    const handlePhoneChange = (newValue: MuiChipsInputChip[]) => {
        formik.setFieldValue("telefonos", newValue)
    }


    return <>
        <form onSubmit={formik.handleSubmit} autoComplete='off'>
            <DialogHeader title={
                id ? "Editar Cliente" : "Nuevo cliente"
            } close={closeDialog} />
            <DialogContent dividers >
                <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                >
                    <Tab value="one" label="Datos Generales" />
                    <Tab value="two" label="Adicionales" />
                </Tabs>

                {/**Datos Generales */}
                {value === "one" && (
                    <Box sx={{ mt: 1 }}>
                        <Grid container spacing={{ xs: 1, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                            <Grid item xs={12} sm={6} md={4}>
                                {
                                    tiposIdentificacion.length > 0 && <TextField fullWidth
                                        id="idTipoIdentificacion"
                                        name="idTipoIdentificacion"
                                        size={texFieldSize}
                                        select
                                        value={formik.values.idTipoIdentificacion > 0 ? formik.values.idTipoIdentificacion : ''}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.idTipoIdentificacion && Boolean(formik.errors.idTipoIdentificacion)}
                                        helperText={formik.touched.idTipoIdentificacion && formik.errors.idTipoIdentificacion}

                                    >
                                        {
                                            tiposIdentificacion.map((item, index) => (
                                                <MenuItem value={item.idTipoIdentificacion} key={index}>
                                                    {item.descripcion}
                                                </MenuItem>
                                            ))
                                        }


                                    </TextField>
                                }
                            </Grid>
                            <Grid item xs={12} sm={6} md={8}>
                                <TextField
                                    size={texFieldSize}
                                    fullWidth
                                    required
                                    autoFocus
                                    label="Nro. Identificación"
                                    id="numeroIdentificacion"
                                    name="numeroIdentificacion"
                                    value={formik.values.numeroIdentificacion}
                                    onChange={(e) => {
                                        customerSearchSRI(e.target.value)
                                    }}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.numeroIdentificacion && Boolean(formik.errors.numeroIdentificacion)}
                                    helperText={formik.touched.numeroIdentificacion && formik.errors.numeroIdentificacion}
                                    InputProps={{
                                        endAdornment:
                                            <FormControlLabel label="SRI" control={
                                                <Switch defaultChecked size="small" onChange={() => {
                                                    formik.setFieldValue('validationSri', false)
                                                    setIsSearchSRI(() => !isSearchSRI)
                                                }} aria-label='SRI' />
                                            } />

                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={12}>
                                <TextField
                                    size={texFieldSize}
                                    fullWidth
                                    required
                                    label="Nombre Fiscal"
                                    id="nombreFiscal"
                                    name="nombreFiscal"
                                    value={formik.values.nombreFiscal}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        formik.setFieldValue("nombreComercial", e.target.value)
                                    }}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.nombreFiscal && Boolean(formik.errors.nombreFiscal)}
                                    helperText={formik.touched.nombreFiscal && formik.errors.nombreFiscal}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={12}>
                                <TextField
                                    fullWidth
                                    size={texFieldSize}
                                    label="Dirección"
                                    id="direccion"
                                    name="direccion"
                                    variant="outlined"
                                    value={formik.values.direccion ?? ""}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    multiline
                                />
                            </Grid>


                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <MuiChipsInput
                                    fullWidth
                                    size="small"
                                    label="Correo"
                                    variant="outlined"
                                    placeholder='Ingrese el correo y presione Enter para agregar'
                                    helperText={formik.values.correos.length > 0 ? "Haga doble clic para editar un correo" : ""}
                                    value={formik.values.correos}
                                    onChange={handleEmailChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <MuiChipsInput
                                    fullWidth
                                    size="small"
                                    label="Teléfono"
                                    variant="outlined"
                                    placeholder='Ingrese el número de teléfono y presione Enter para agregar'
                                    helperText={formik.values.telefonos.length > 0 ? "Haga doble clic para editar un teléfono" : ""}
                                    value={formik.values.telefonos}
                                    onChange={handlePhoneChange}
                                />
                            </Grid>

                        </Grid>
                    </Box>
                )}

                {/**Datos Adicionales */}

                {value === "two" && (
                    <Box sx={{ p: 3 }}>
                        adicionales
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button type="submit" variant='contained' size='large' color='success' disabled={!formik.isValid}>
                    {
                        id ? "Actualizar" : "Guardar"
                    }
                </Button>
                <Button variant='outlined' color='inherit' size='large' onClick={() => closeDialog()}>Cerrar</Button>
            </DialogActions>
        </form>
    </>
}

export default CompanyCustomerAddEditDialog