import { usePaymentStore } from "@/store/payment/paymentStore.";
import { MenuItem, TextField } from "@mui/material";

const PaymentSubType = () => {
    const { dataForm, paymentData, setChangeFieldFormPayment } = usePaymentStore(state => state);
    const dataPaymentType = dataForm.paymentTypes.find(p => p.paymentTypeId === paymentData.paymentTypeId);

    const paymentSubTypes = dataPaymentType ? dataPaymentType.paymentSubTypes : []


    return (
        <>
            {paymentSubTypes.length > 0 && <TextField fullWidth
                id="paymentSubType"
                name="paymentSubType"
                label="SubEntidad Financiera"

                select
                value={paymentData.paymentSubTypeId}
                onChange={(e) => {
                    const paymentData = paymentSubTypes.find(item => item.paymentSubTypeId === Number(e.target.value));
                    const paymentSubTypeId = paymentData?.paymentSubTypeId ?? 0
                    setChangeFieldFormPayment("paymentSubTypeId", paymentSubTypeId)
                }}
            >
                {
                    paymentSubTypes.map((item, index) => (
                        <MenuItem value={item.paymentSubTypeId} key={index}>
                            {item.description}
                        </MenuItem>
                    ))
                }
            </TextField>
            }
        </>
    )
}

export default PaymentSubType