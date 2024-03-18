import { pricingCalculateUtil } from './pricing-calculate.util';
import { TaxRate } from "@/models/tax-rate.model"
import { roundNumber } from './round-number.util';
import { TAX_CODE } from '@/constants/constants';

type ExtendProps = {
    quantity: number
    price: number
    discount: number
    taxPercentId: number
}

export const calculateTaxesTotals = function <T extends ExtendProps[]>(items: T, taxRates: Record<string, TaxRate>) {

    // Inicializar las variables para almacenar los totales de impuestos
    const dataTotales = [];
    let sumTotalIva = 0;

    // Calcular totales generales
    const { totalPrecioTotalSinImpuesto, totalDescuento } = items.reduce((acc, prev) => {
        // Calcular el total neto con descuentos y el total de ICE
        const totalSinImpuesto = prev.quantity * prev.price;
        const precioTotalSinImpuesto = (prev.quantity * prev.price) - prev.discount

        // Acumular totales generales 
        acc.totalPrecioTotalSinImpuesto += precioTotalSinImpuesto;
        acc.totalDescuento += prev.discount;
        acc.totalSinImpuesto += totalSinImpuesto;
        return acc;
    }, {
        totalPrecioTotalSinImpuesto: 0,
        totalDescuento: 0,
        totalSinImpuesto: 0

    });

    dataTotales.push({
        name: 'Subtotal',
        value: roundNumber(totalPrecioTotalSinImpuesto, 5)
    })

    if(totalDescuento>0){
        dataTotales.push({
            name: 'Descuento',
            value: roundNumber(totalDescuento)
        })
    }

    const tarifasImpuesto = Object.values(taxRates).filter(tax => tax.codImpuesto === TAX_CODE.IVA);
    
    // Calcular totales específicos por tarifa de impuesto
    for (const dataTarifaImpuesto of tarifasImpuesto) {
        const filteredItems = items.filter(item => item.taxPercentId === dataTarifaImpuesto.idTarifaImpuesto); 
     
        if (dataTarifaImpuesto.porcentaje > 0) {
            const { totalIva } = filteredItems.reduce((acc, prev) => {
                // Calcular el total neto con descuentos 
                const precioTotalSinImpuesto = (prev.price * prev.quantity) - prev.discount;
                acc.totalIva += pricingCalculateUtil.calculateTaxValue(precioTotalSinImpuesto, dataTarifaImpuesto.porcentaje);
                return acc;
            }, {
                totalIva: 0,
            }); 
            sumTotalIva += totalIva;

            if (totalIva > 0) {
                dataTotales.push({
                    name: dataTarifaImpuesto.descripcion,
                    value: roundNumber(totalIva, 2)
                }) 
            }
        }

    }
 
    const importeTotal = totalPrecioTotalSinImpuesto + sumTotalIva;  
    const subTotalSinImpuestos = roundNumber(totalPrecioTotalSinImpuesto, 5); 

    dataTotales.push({
        name: "Total",
        value: roundNumber(importeTotal),
        color: 'error',
        fontSize: 15
    }) 
    // Retornar los totales calculados
    return {
        dataTotales,
        stringTaxexTotals: '',
        subTotalSinImpuestos,
        totalDescuento: roundNumber(totalDescuento, 5), 
        importeTotal: roundNumber(importeTotal, 5)
    };


}