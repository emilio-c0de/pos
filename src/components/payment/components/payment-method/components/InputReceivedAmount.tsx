import { PaymentsIcon } from '@/components/common/IconsMaterial';
import { usePaymentStore } from '@/store/payment/paymentStore.';
import { validateNumber } from '@/utils/utils';
import { InputAdornment, TextField } from '@mui/material';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

const InputReceivedAmount = () => {
    const { paymentData, setChangeFieldFormPayment } = usePaymentStore(state => state);

    const [value, setValue] = useState<number | string>(paymentData.receivedAmount)

    // Memoize the callback using useCallback
    const memoizedCallback = useCallback(
        (newValue: number | string) => {
            setValue(newValue);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [paymentData.receivedAmount]
    );

    useEffect(() => {
        // Call the memoized callback when the local quantity changes
        memoizedCallback(paymentData.receivedAmount);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentData, memoizedCallback]);

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        event.target.select();
    }

    const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {

        const inputValue = event.target.value;
        if (inputValue.split(".")[1]?.length >= 5) return
        setValue(inputValue)

    }
    const onBlurInput = () => {
        if (value && validateNumber(value)) {
            if (Number(value) !== paymentData.receivedAmount) {
                setChangeFieldFormPayment("receivedAmount", Number(value))
            } else {
                setValue(paymentData.receivedAmount)
            }

        } else {
            setValue(paymentData.receivedAmount)
        }
    } 
    return (
        <TextField
            fullWidth

            id="cashValue"
            name='cashValue'
            label="Valor Cobro"
            value={value}
            onChange={onChangeInput}
            onFocus={handleFocus}
            onBlur={() => onBlurInput()}
            InputProps={{
                startAdornment: <InputAdornment position="start">
                    <PaymentsIcon />
                </InputAdornment>,
            }}
            inputProps={{
                style: {
                    textAlign: 'right',
                    // fontSize: 30,
                },
            }}
        />
    )
}

export default InputReceivedAmount