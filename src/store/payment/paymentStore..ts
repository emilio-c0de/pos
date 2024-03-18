import { PaymentTypeCode } from "@/constants/constants"
import { CuentaPorCobrarProps } from "@/models/external/cuenta-por-cobrar.model"
import { cuentaPorCobrarSvc } from "@/services/external/cuenta-por-cobrar.service"
import CheckoutUtil, { getPaymentSubTotales, getTotalesCuota } from "@/utils/checkout.util"
import { roundNumber } from "@/utils/round-number.util"
import { notify, ToastType } from "@/utils/toastify/toastify.util"
import { isValidField } from '@/utils/utils';
import { produce } from "immer"
import Swal from "sweetalert2"
import { create, StateCreator } from "zustand"

import { MultiplesPaymentType, PaymentData, PaymentDataForm, paymentDataFormInitialState, paymentDataInitialState, PaymentDetail, PaymentHistory, PaymentSubTotal, paymentSubTotalInitialState } from "./type"
import { comprobanteIngresoAdapter } from "@/adapters/comprobante-ingreso.adapter"
import { comprobanteIngresoSvc } from "@/services/external/comprobante-ingreso.service"
import { isApiResponse } from "@/models/api-response"
import { hideLoader, showLoader } from "@/utils/loader"

interface PaymentState<T> {
    closeDialog<U>(data?: U): void
    error: string | null
    loading: boolean
    dataForm: T
    cloneDataForm: T,
    paymentData: PaymentData
    paymentSubTotal: PaymentSubTotal
    multiplesPaymentType: Array<MultiplesPaymentType>
    paymentDetails: Array<PaymentDetail>
    historialCuentas: Array<PaymentHistory>

}

interface Actions<T> {
    fetchDataForm(data: CuentaPorCobrarProps, closeDialog: () => void): void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    setDataForm(data: T): void
    setChangeFieldFormPayment<T extends keyof typeof paymentDataInitialState>(
        prop: T,
        value: typeof paymentDataInitialState[T]
    ): void;
    removePaymentType(index: number): void
    setChangePaymentType(data: Partial<PaymentData>): void;
    addPaymentType(): void
    isValidData(): boolean | undefined
    save(): void
}

interface ActionsCalculator {
    calculatorOnClickBtnClear(): void
    calculatorOnClickButton(value: string | number): void
    calculatorOnCickOptionDollar(value:number):void
}

type PaymentStateCreator = PaymentState<PaymentDataForm> & Actions<PaymentDataForm> & ActionsCalculator
const MAX_NUMBER_ROUND_GENERAL = 3;
//const MAX_NUMBER_ROUND_CUOTA_ABONO = 5;

const createSharedSlice: StateCreator<
    PaymentStateCreator,
    [],
    [],
    PaymentStateCreator
> = (set, get) => ({
    closeDialog: () => { },
    error: null,
    loading: false,
    dataForm: paymentDataFormInitialState,
    cloneDataForm: paymentDataFormInitialState,
    paymentData: paymentDataInitialState,
    paymentSubTotal: paymentSubTotalInitialState,
    multiplesPaymentType: [],
    paymentDetails: [],
    historialCuentas: [],
    fetchDataForm(data, closeDialog) {
        try {
            set(
                produce((state: PaymentStateCreator) => {
                    state.closeDialog = closeDialog;
                    state.loading = true;
                })
            )

            cuentaPorCobrarSvc.getDataPayment(data).then(response => {
                const { paymentTypes } = response;
                const paymentTypeData = paymentTypes.find(item => item.code === PaymentTypeCode.EFE);
                if (paymentTypeData) {

                    set(produce((state: PaymentStateCreator) => {
                        const paymentSubTypeData = paymentTypeData.paymentSubTypes[0]
                        const paymentSubTotal = getTotalesCuota(response.cuentasPorCobrar);

                        state.cloneDataForm = structuredClone(response);
                        state.dataForm = structuredClone(response);
                        state.paymentData.paymentTypeId = paymentTypeData.paymentTypeId;
                        state.paymentData.paymentTypeCode = paymentTypeData.code
                        state.paymentData.paymentTypeDescription = paymentTypeData.description;
                        state.paymentData.paymentSubTypeId = paymentSubTypeData ? paymentSubTypeData.paymentSubTypeId : 0;
                        state.paymentData.receivedAmount = roundNumber(paymentSubTotal.totalSaldo, 3);
                        state.paymentSubTotal = paymentSubTotal;

                    }))
                }

            }).catch(error => {
                console.log(error)
                set(
                    produce((state: PaymentStateCreator) => {
                        state.loading = false;
                        state.error = error
                    })
                )
            })
                .finally(() => {
                    set(
                        produce((state: PaymentStateCreator) => {
                            state.loading = false;
                        })
                    )
                })
        } catch (error) {
            set(
                produce((state: PaymentStateCreator) => {
                    state.loading = false;
                    state.error = null
                })
            )
        }
    },
    setLoading: (loading) => {
        set(produce((state: PaymentStateCreator) => {
            state.loading = loading;
        }))
    },
    setError(error) {
        set(state => {
            state.error = error;
            return state;
        })
    },
    setDataForm(dataForm) {
        set(state => {
            state.dataForm = dataForm;
            return state;
        })
    },
    setChangeFieldFormPayment(prop, value) {
        set(produce((state: PaymentStateCreator) => {
            state.paymentData[prop] = value
        }))
    },
    removePaymentType(index) {
        const { cloneDataForm, dataForm, multiplesPaymentType } = get();
        try {
            Swal.fire({
                html: `<small>Esta seguro/a de eliminar este Abono ahora?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar',
                cancelButtonText: 'No, cancelar'
            }).then(result => {
                if (result.isConfirmed) {
                    let paymentDetails: Array<PaymentDetail> = [];
                    let historialCuentas: Array<PaymentHistory> = [];

                    const tempMultiplesPaymentType = multiplesPaymentType.filter((_, key) => key !== index)


                    //Todas las cuotas en su estado original 
                    let tempCuentasPorCobrar = dataForm.cuentasPorCobrar.map(vc => ({
                        ...vc,
                        cuotas: structuredClone(vc.cuotasOriginal)
                    }))

                    //    state.dataSubTotal = getTotalesCuota(tempCuentasPorCobrar)

                    //if (tempMultiplesPaymentType.length == 0) return state;

                    //Recalculamos las cuotas con los abonos restantes   
                    let sequential = 0;
                    for (const item of tempMultiplesPaymentType) {
                        sequential++;

                        const checkoutUtility = new CheckoutUtil(sequential);
                        checkoutUtility.setReceivedAmount(Number(item.receivedAmount));
                        checkoutUtility.setPaymentDetail(paymentDetails)

                        tempCuentasPorCobrar = checkoutUtility.applyReceivedAmountToQuota(tempCuentasPorCobrar);
                        paymentDetails = checkoutUtility.paymentDetails;
                        historialCuentas = checkoutUtility.historialCuentas;
                    }
                    const dataSubTotal = getPaymentSubTotales(tempCuentasPorCobrar, tempMultiplesPaymentType, cloneDataForm.comprobante)

                    set(produce((state: PaymentStateCreator) => {
                        state.paymentSubTotal.totalSaldo = dataSubTotal.totalSaldo;
                        state.paymentSubTotal.totalValorAbono = dataSubTotal.totalSaldo;
                        state.paymentSubTotal.cambio = dataSubTotal.valorCambio;
                        state.paymentSubTotal.receivedAmount = roundNumber(dataSubTotal.totalSaldo, MAX_NUMBER_ROUND_GENERAL);
                        state.dataForm.cuentasPorCobrar = tempCuentasPorCobrar;

                        state.multiplesPaymentType = tempMultiplesPaymentType;
                        state.paymentDetails = paymentDetails;
                        state.historialCuentas = historialCuentas;
                        state.paymentData = {
                            ...state.paymentData,
                            receivedAmount: roundNumber(dataSubTotal.totalSaldo, MAX_NUMBER_ROUND_GENERAL),
                            nro: "",
                            referencia: "",
                            aprobacion: "",
                            lote: "",
                            cityId: 0,
                            idBanco: 0
                        }
                    }))
                }
            })
        } catch (error) {
            console.log(error)
        }
    },
    setChangePaymentType(paymentData) {
        set(produce((state: PaymentStateCreator) => {
            state.paymentData = {
                ...state.paymentData,
                ...paymentData
            };
        }))
    },
    isValidData() {
        const {
            receivedAmount,
            paymentSubTypeId,
            paymentTypeCode,
            nro,
            cityId,
            referencia,
            aprobacion,
            lote,
            idBanco
        } = get().paymentData;
        if (!(paymentSubTypeId > 0)) {
            notify({
                type: ToastType.Warning,
                content: 'Seleccione la SubEntidad Financiera'
            })
            return
        }

        // if(!cobro.fechaEmision){
        //     this.tS.toastr('warning', 'Ingrese la fecha de emisión')
        //     return
        // }
        // if(!this.isDateValid(cobro.fechaEmision)){
        //     this.tS.toastr('warning', 'Ingrese una fecha válida')
        //     return
        // } 

        if (!(Number(receivedAmount) > 0)) {
            notify({
                type: ToastType.Warning,
                content: 'Ingrese el valor de abono'
            })
            return
        }

        // =================== TARJETA DE CREDITO / DEBITO  =================================== //
        if (paymentTypeCode === PaymentTypeCode.TAR) {
            if (!isValidField(nro)) {
                notify({
                    type: ToastType.Warning,
                    content: 'Ingrese el Número'
                })
                return
            }

            if (!(cityId && cityId > 0)) {
                notify({
                    type: ToastType.Warning,
                    content: 'Seleccione la ciudad'
                })
                return
            }
            if (!isValidField(referencia)) {
                notify({
                    type: ToastType.Warning,
                    content: 'Ingrese la referencia'
                })
                return
            }
            if (!isValidField(aprobacion)) {
                notify({
                    type: ToastType.Warning,
                    content: 'Ingrese la Aprobación'
                })
                return
            }
            if (!isValidField(lote)) {
                notify({
                    type: ToastType.Warning,
                    content: 'Ingrese el Lote'
                })
                return
            }
        }

        // =================== TRANSFERENCIAS  =================================== //

        if (paymentTypeCode === PaymentTypeCode.TRA) {
            if (!(idBanco && idBanco > 0)) {
                notify({
                    type: ToastType.Warning,
                    content: 'Seleccione el Banco'
                })
                return
            }
            if (!isValidField(nro)) {
                notify({
                    type: ToastType.Warning,
                    content: 'Ingrese el Número'
                })
                return
            }
        }

        // =================== CHEQUES  =================================== //

        if (paymentTypeCode === PaymentTypeCode.CHE) {
            if (!(idBanco && idBanco > 0)) {
                notify({
                    type: ToastType.Warning,
                    content: 'Seleccione el Banco'
                })
                return
            }
            if (!isValidField(nro)) {
                notify({
                    type: ToastType.Warning,
                    content: 'Ingrese el Número'
                })
                return
            }

            if (!(cityId && cityId > 0)) {
                notify({
                    type: ToastType.Warning,
                    content: 'Seleccione la ciudad'
                })
                return
            }
            if (!isValidField(referencia)) {
                notify({
                    type: ToastType.Warning,
                    content: 'Ingrese la referencia'
                })
                return
            }
        }

        return true;
    },
    addPaymentType() {
        try {
            const { paymentSubTotal,
                dataForm,
                paymentData,
                multiplesPaymentType,
                paymentDetails,
                isValidData
            } = get();
            const { cuentasPorCobrar } = dataForm;
            if (paymentSubTotal.totalSaldo == 0 || paymentSubTotal.totalSaldo < 0) {
                Swal.fire({
                    icon: 'warning',
                    html: 'No tienes saldo pendiente!'
                })
                return
            }
            if (!isValidData()) return;
            const tempPaymentDetails = structuredClone(paymentDetails);

            const sequential = multiplesPaymentType.length;
            const checkoutUtility = new CheckoutUtil(sequential);
            checkoutUtility.setReceivedAmount(Number(paymentData.receivedAmount))
            checkoutUtility.setPaymentDetail(tempPaymentDetails)

            const modifiedQuotas = checkoutUtility.applyReceivedAmountToQuota(cuentasPorCobrar);
            const resultPaymentDetails = checkoutUtility.paymentDetails;

            const payingAmount = resultPaymentDetails.filter(item => item.secuencial === sequential)
                .reduce((prev, curr) => prev + curr.abono, 0);

            const dataPaymentType = dataForm.paymentTypes.find(p => p.code === paymentData.paymentTypeCode)

            const dataPaymentSubType = dataPaymentType?.paymentSubTypes.find(item => item.paymentSubTypeId === paymentData.paymentSubTypeId)
            const infoCobro = [{
                nro: paymentData.nro,
                lote: paymentData.lote,
                aprobacion: paymentData.aprobacion,
                referencia: paymentData.referencia,
                idCiudad: paymentData.cityId
            }]
            const dataPaymentTypeForm = {
                paymentTypeId: paymentData.paymentTypeId,
                paymentSubTypeId: paymentData.paymentSubTypeId,
                idBanco: isValidField(paymentData.idBanco),
                creationDate: new Date(),
                receivedAmount: Number(paymentData.receivedAmount),
                payingAmount: roundNumber(payingAmount, 2),
                sequential,
                isControlBox: dataPaymentSubType?.isControlBox || false,
                paymentTypeCode: paymentData.paymentTypeCode,
                paymentTypeDescription: paymentData.paymentTypeDescription,
                posfechado: paymentData.posfechado,
                nro: paymentData.nro,
                lote: paymentData.lote,
                aprobacion: paymentData.aprobacion,
                referencia: paymentData.referencia,
                idCiudad: isValidField(paymentData.cityId),
                infoCobro: paymentData.paymentTypeCode === PaymentTypeCode.EFE ? undefined : JSON.stringify(infoCobro),
                paymentSubTypeName: dataPaymentSubType?.description || "",
                idCuentaBancaria: null,
            }


            const tempMultiplesPaymentType = [...multiplesPaymentType, dataPaymentTypeForm];
            const dataSubTotal = getPaymentSubTotales(modifiedQuotas, tempMultiplesPaymentType, dataForm.comprobante)
         
            set(produce((state: PaymentStateCreator) => {
                state.paymentSubTotal.totalSaldo = dataSubTotal.totalSaldo;
                state.paymentSubTotal.totalValorAbono = dataSubTotal.totalValorAbono;
                state.paymentSubTotal.cambio = dataSubTotal.valorCambio;
                state.paymentSubTotal.receivedAmount = roundNumber(dataSubTotal.totalSaldo, MAX_NUMBER_ROUND_GENERAL);
                state.dataForm.cuentasPorCobrar = modifiedQuotas;
                state.multiplesPaymentType = tempMultiplesPaymentType;
                state.paymentDetails = resultPaymentDetails;
                state.historialCuentas = checkoutUtility.historialCuentas;
                state.paymentData = {
                    ...state.paymentData,
                    receivedAmount: roundNumber(dataSubTotal.totalSaldo, MAX_NUMBER_ROUND_GENERAL),
                    nro: "",
                    referencia: "",
                    aprobacion: "",
                    lote: "",
                    cityId: 0,
                    idBanco: 0
                }
            }))
            notify({
                type: ToastType.Success,
                content: 'Agregado Correctamente'
            })

        } catch (error) {
            console.log(error)
            notify({
                type: ToastType.Error,
                content: error as string
            })
        }

    },
    async save() {
        const { closeDialog, dataForm, multiplesPaymentType, paymentDetails, historialCuentas } = get();
        try {

            if (!(dataForm.comprobante.idCliente > 0)) {
                Swal.fire({
                    icon: 'info',
                    html: 'Seleccione el cliente'
                })
                return
            }
            if (multiplesPaymentType.length === 0) {
                Swal.fire({
                    icon: 'info',
                    html: 'Ingrese al menos un abono'
                })
                return
            }

            if (paymentDetails.length === 0) {
                Swal.fire({
                    icon: 'info',
                    html: 'Cobro detalle vacio!'
                })
                return
            }

            const { isConfirmed } = await Swal.fire({
                // title: 'Guardar Cobro?',
                text: "Esta seguro de guardar el cobro?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, guardar!',
                cancelButtonText: 'No, cancelar!'
            })
            if (!isConfirmed) return

            // const checkoutUtility = new CheckoutUtility(0);
            // const historyPayments = checkoutUtility.getHistoryPayments(dataForm.voucherQuotas, paymentDetails);
            const comprobante = {
                idCliente: dataForm.comprobante.idCliente,
                total: multiplesPaymentType.reduce((acc, curr) => acc + Number(curr.receivedAmount), 0),
                abono: multiplesPaymentType.reduce((acc, curr) => acc + curr.payingAmount, 0),
                codEstab: dataForm.comprobante.codEstab,
                numeroIdentificacion: dataForm.comprobante.identificacionComprador,
                nombreFiscal: dataForm.comprobante.razonSocialComprador,
            }
            const cobroDetalle = paymentDetails.filter(item => (item.abono > 0))

            const params = comprobanteIngresoAdapter.postTo({
                comprobante,
                multiplesPaymentType,
                paymentDetails: cobroDetalle,
                historialCuentas

            })

            showLoader();
            comprobanteIngresoSvc.post(params).then(response => {
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
                        if (typeof closeDialog === 'function') {
                            closeDialog(response)
                        }
                    }
                }
            }).catch(error => {
                notify({
                    type: ToastType.Warning,
                    content: error as string
                })
            }).finally(() => {
                hideLoader();
            })

        } catch (error) {
            console.log(error)
            hideLoader();

        }
    },

    //Opciones Calculadora
    calculatorOnClickBtnClear() {
        try {
            const { paymentData, setChangeFieldFormPayment } = get();
            const numeroStr = paymentData.receivedAmount.toString();
            let receivedAmount: string = numeroStr;


            const nuevoNumeroStr = numeroStr.substring(0, numeroStr.length - 1); // Elimina los últimos "cantidad" dígitos
            receivedAmount = nuevoNumeroStr;

            if (receivedAmount[receivedAmount.length - 1] === '.') {
                receivedAmount = receivedAmount.slice(0, -1);
            }
            setChangeFieldFormPayment("receivedAmount", receivedAmount)
        } catch (error) {
            console.log(error)
        }
    },
    calculatorOnClickButton(value) {
        const { paymentData, setChangeFieldFormPayment } = get();

        const numeroStr = paymentData.receivedAmount.toString();
        const valueCalculator = value.toString();
        if (valueCalculator[0] === "." && ["", undefined, null].includes(numeroStr)) return
        if (numeroStr === "0" && (valueCalculator === "0")) return

        if (value === "." && numeroStr.split(".").length > 1) return

        if (numeroStr.split(".")[1]?.length >= 5) return
        setChangeFieldFormPayment("receivedAmount", numeroStr + valueCalculator);
    },

    calculatorOnCickOptionDollar(value){
        const { setChangeFieldFormPayment } = get();
        setChangeFieldFormPayment("receivedAmount", value); 
    }

})


export const usePaymentStore = create<PaymentStateCreator>()((...a) => ({
    ...createSharedSlice(...a),
}))