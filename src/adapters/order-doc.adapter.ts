import { OrderDocRaw } from "@/models/order-doc.model";

class OrderDocAdapter {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getAllFrom(orderDocs: any): Array<OrderDocRaw> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const results = orderDocs.map((data: any) => ({
            codEstab: data.codEstab,
            idCuentaPorCobrar: data.idCuentaPorCobrar,
            documentoId: data.documentoId,
            orderId: data.orderId,
            docType: data.docType,
            serie: data.serie,
            serieComprobante: data.serieComprobante,
            createAt: data.createAt,
            customerName: data.customerName,
            userName: data.userName,
            tiempoCredito: data.tiempoCredito,
            importeTotal: data.importeTotal,
            abono: data.abono,
            saldo: data.saldo,
            estado: data.estado,
            telefono: data.telefono,
            telefonoEstablecimiento: data.telefonoEstablecimiento,
            nombreComercial: data.nombreComercial,
            codEstado: data.codEstado,
        }))
        return results;
    }

    

}

export const orderDocAdapter = new OrderDocAdapter();