import { PATHS, PATHS_API } from "@/constants/constants";
import { isApiResponse } from "@/models/api-response";
import { http } from "@/utils/http";
import { hideLoader, showLoader } from "@/utils/loader";
import { notify, ToastType } from "@/utils/toastify/toastify.util";
import FileSaver from "file-saver"
import Swal from "sweetalert2"

type ParamsPrint = { id: number, documentoId: number, tipo: 1 | 2 | 3 | 4 }


class Shared {
    async downloadExternal(parameters: object, returnData = false, oldVersion = false) {
        
        try {
            const url = oldVersion ? `${PATHS_API.REPORT}${PATHS.REPORT_V1}` : `${PATHS_API.REPORT}${PATHS.REPORT_V2}`
            showLoader();
            const resultAxios = await http({
                method: 'post',
                url: `${url}Download`,
                data: JSON.stringify(parameters),
                responseType: 'blob'
            })
            hideLoader()

            if (!returnData) {
                const ieEDGE = navigator.userAgent.match(/Edge/g);
                const ie = navigator.userAgent.match(/.NET/g); // IE 11+
                const oldIE = navigator.userAgent.match(/MSIE/g);
                const blob = new window.Blob([resultAxios.data], {
                    type: resultAxios.headers["content-type"],
                });
                let fileName = resultAxios.headers["content-disposition"]
                    .split(";")[1]
                    .split("=")[1]
                    .replace('"', "");
                fileName = fileName.replace('"', "");
                if (ie || oldIE || ieEDGE) {
                    FileSaver.saveAs(blob, fileName);
                } else {
                    const fileURL = URL.createObjectURL(blob);
                    window.open(fileURL, fileName);
                }
                return
            }
            return resultAxios
        } catch (error) {
            console.log(error)
            hideLoader();
        }
    }

    async askToPrint(obj: ParamsPrint) {
        const {
            isConfirmed
        } = await Swal.fire({
            icon: 'warning',
            html: `<small>Desea Imprimir este comprobante?</small>`,
            confirmButtonText: '<icon class="mdi mdi-cloud-print-outline"></icon> Sí, imprimir',
            showDenyButton: true,
            denyButtonText: 'No, cancelar',
            allowOutsideClick: false
        })
        if (isConfirmed) {
            this.getPrinter(obj)
        }
    }

    async getPrinter(obj: ParamsPrint) {
        const resultAxios = await http({
            method: 'get',
            url: `${PATHS_API.PRIVATE}${PATHS.ORDER}Print/${JSON.stringify(obj)}`,
        })

        const response = resultAxios.data;
        if (isApiResponse(response)) {
            if (response.code === "0") {
                notify({
                    type: ToastType.Warning,
                    content: response.message
                })
            }
            if (response.code === "1") {
                this.print(JSON.parse(response.payload as string));
            }
        }
    }
    async print<T extends { urlPrinter: string }>(params: T[]) {
        for (const param of params) {
            const resultAxios = await http({
                method: 'post',
                url: param.urlPrinter,
                data: JSON.stringify(param)
            });
            const response = resultAxios.data;
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
                }
            }
        }
    }
}
export const sharedSvc = new Shared()



