import { useState } from 'react'
import DialogHeader from '../ui/DialogHeader'
import { Button, DialogActions, DialogContent, Grid } from '@mui/material'
import { MuiChipsInput } from 'mui-chips-input'
import { SendIcon } from '../common/IconsMaterial'
import axios, { AxiosResponse } from 'axios'
import Swal from 'sweetalert2'
import { CODE_REPORT, DOC_TYPE } from '@/constants/constants'
import { sharedSvc } from '@/services/shared.service'
import { ToastType, notify } from '@/utils/toastify/toastify.util'
import { hideLoader, showLoader } from '@/utils/loader'

const URL_API_WHATSAPP = import.meta.env.URL_API_WHATSAPP;
 
const URL_FILE_UPLOAD = import.meta.env.URL_FILE_UPLOAD;
const URL_SMS = import.meta.env.URL_SMS 

const http = axios.create({
    baseURL: URL_API_WHATSAPP
})

const phoneNumberFormatter = (number: string) => {
    let formatted = number.replace(/\D/g, '')
    if (formatted.startsWith('0')) {
        formatted = '593' + formatted.slice(1)
    }
    if (!formatted.endsWith('@c.us')) {
        formatted += '@c.us'
    }
    return formatted
}

type Data = {
    telefono?: string,
    documentoId: number,
    docType: string,
    codEstab: string
    telefonoEstablecimiento?: string
    nombreComercial?: string, 
}
type SendWhatsappProps = {
    close(): void
    data: Data
}
const SendWhatsapp = ({ close, data }: SendWhatsappProps) => {
    const tempPhoneNumbers = data.telefono ? data.telefono.split(';') : [];
    const [phoneNumbers, setPhoneNumbers] = useState<string[]>(tempPhoneNumbers); 

    const sendSMS = async (message: string) => {
        const payload = {
            chatId: phoneNumberFormatter(phoneNumbers[0]!),
            message,
        }
        const response = await http.post(URL_SMS, JSON.stringify(payload), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response;
    }

    const sendMedia = async (caption: string, file: File) => {
        try {
            const payload = new FormData();
            const formettedPhoneNumber = phoneNumberFormatter(phoneNumbers[0]!)
            payload.append("caption", caption)
            payload.append("chatId", formettedPhoneNumber)
            payload.append("file", file)

            let messageEstab;
            const messageInfo = 'Gracias por preferirnos, este comprobante se adjuntara a su correo electrónico!.';
            const messageFooter = `*_Por favor responda con un OK y agregue este número a sus contactos_*`;

            if (data.telefonoEstablecimiento) {
                messageEstab = `Si tiene alguna observación, favor comunicarse con la empresa *${data.nombreComercial}* al siguiente número: *${data.telefonoEstablecimiento}*`
            }
            showLoader()
            await Promise.all([
                sendSMS('ACONTPLUS adjunta el siguiente comprobante electrónico:'),
                await http.post(URL_FILE_UPLOAD, payload),
                await sendSMS(messageEstab ?? ''),
                await sendSMS(messageInfo),
                await sendSMS(messageFooter),
            ]).then(response => {
                console.log(response)
                Swal.fire({
                    icon: 'success',
                    text: 'Enviado correctamente',
                    timer: 2000
                })
            })
            hideLoader();
        } catch (error) {
            hideLoader();
            console.log(error);
        }

    }

    const contentFile = (responseFile: AxiosResponse) => {
        const responseHeaders = responseFile.headers;
        const fileName = responseHeaders["content-disposition"].split(";")[1].split("=")[1];
        const file = new File([responseFile.data], fileName, { type: responseHeaders["content-type"] })
        return {
            file,
            fileName
        }
    }


    const generateFile = async () => {
        try {
            const format = 'pdf';
            /**
             * Factura 
             */
            if (data.docType === DOC_TYPE.FV) {
                const dataParms = {
                    id: data.documentoId,
                    codEstab: data.codEstab,
                    codigo: CODE_REPORT.FV,
                    format,
                }
                const parameters = {
                    hasService: true,
                    reportParams: JSON.stringify({
                        hasParams: true,
                        codigo: CODE_REPORT.FV,
                        codEstab: data.codEstab,
                        format,
                        aditionalParams: []
                    }),
                    dataParams: JSON.stringify(dataParms)
                }
                showLoader();
                const responseFile = await sharedSvc.downloadExternal(parameters, true, true);
                if (responseFile) {
                    const { file, fileName } = contentFile(responseFile);
                    await sendMedia(fileName, file)
                }
                hideLoader()
            }

            /**
             * Nota de Entrega
             */
            if (data.docType === DOC_TYPE.NE) {
                const parameters = {
                    hasService: true,
                    reportParams: JSON.stringify({
                        hasParams: true,
                        codigo: CODE_REPORT.NE,
                        codEstab: data.codEstab,
                        format,
                        aditionalParams: []
                    }),
                    dataParams: JSON.stringify({
                        id: data.documentoId
                    })
                }

                showLoader()
                const responseFile = await sharedSvc.downloadExternal(parameters, true, true);
                if (responseFile) {
                    const { file, fileName } = contentFile(responseFile);
                    await sendMedia(fileName, file)
                }
                hideLoader()
            }

            //Orden de pedido
            if (data.docType === DOC_TYPE.OR) {

                const parameters = {
                    reportParams: JSON.stringify({
                        codigo: CODE_REPORT.OR,
                        codEstab: data.codEstab,
                        format,
                    }),
                    dataParams: JSON.stringify({
                        id: data.documentoId
                    })
                }
                showLoader()
                const responseFile = await sharedSvc.downloadExternal(parameters, true)
                if (responseFile) {
                    const { file, fileName } = contentFile(responseFile);
                    await sendMedia(fileName, file)
                }
                hideLoader()
            }
        } catch (error) {
            console.log(error)
            hideLoader()
        }
    }

    const sendToWhatsApp = async () => {
        try {
            if (phoneNumbers.length === 0) {
                notify({
                    type: ToastType.Warning,
                    content: 'Ingrese el número de celular'
                })
                return
            }
            if (phoneNumbers.length === 2) {
                notify({
                    type: ToastType.Warning,
                    content: 'Por favor, introduzca únicamente un número de celular'
                })
                return
            }
            if (phoneNumbers.some(phone => isNaN(Number(phone)))) {
                notify({
                    type: ToastType.Warning,
                    content: 'Ingrese número de celular válido!'
                })
                return
            }

            if (phoneNumbers.some(phone => phone.length !== 10)) {
                notify({
                    type: ToastType.Warning,
                    content: 'El número de celular tiene que ser de diez digitos!'
                })
                return
            }
            generateFile();
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <DialogHeader title={"Envío de notificación por WhatsApp"} close={close} />
            <DialogContent dividers>
                <MuiChipsInput
                    fullWidth
                    label="Número de Teléfono"
                    variant="outlined"
                    placeholder='Ej: 0959889741'
                    helperText={phoneNumbers.length > 0 ? "Haga doble clic para editar un teléfono" : 'Ingrese el número de teléfono móvil y presione la tecla Enter.'}
                    value={phoneNumbers}
                    focused
                    onChange={(e) => {
                        setPhoneNumbers(e)
                    }}
                    validate={(chipValue) => {
                        if (isNaN(Number(chipValue))) {
                            return {
                                isError: true,
                                textError: 'Ingrese un número válido '
                            }

                        }
                        if (chipValue.length !== 10) {
                            return {
                                isError: true,
                                textError: 'El valor debe tener exactamente 10 caracteres'
                            }
                        }
                        if (phoneNumbers.includes(chipValue)) {
                            return {
                                isError: true,
                                textError: 'Este número de teléfono ya ha sido ingresado'
                            }
                        }
                        return {
                            isError: false,
                            textError: ''
                        }
                    }}
                />
            </DialogContent>

            <DialogActions>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Button
                            variant='contained'
                            size='large'
                            startIcon={<SendIcon />}
                            fullWidth
                            onClick={sendToWhatsApp}
                            disabled={phoneNumbers.length === 0}
                        >
                            Enviar
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button color='inherit' variant='outlined' size='large' fullWidth onClick={() => close()}  >
                            Cerrar
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </>
    )
}

export default SendWhatsapp