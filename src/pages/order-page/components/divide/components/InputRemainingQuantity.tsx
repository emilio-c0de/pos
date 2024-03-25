import { useDivideStore } from '@/store/order/divide/divide.slice'
import { OrderItemDivide } from '@/store/order/divide/divide.type'
import { isValidField } from '@/utils/utils'
import InputBase from '@mui/material/InputBase'
import React, { useCallback, useEffect, useState } from 'react'

type InputRemainingQuantityProps = {
    item: OrderItemDivide
    changeInputQuantity(newQuantity: number): void
}
const InputRemainingQuantity = ({ item, changeInputQuantity }: InputRemainingQuantityProps) => {
    const { orderDivideItems } = useDivideStore(state => state)
    const remainingQuantity = item.remainingQuantity || 0;
    const [quantity, setQuantity] = useState<number | string>(remainingQuantity);

    const handleFocus = (
        event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement> | React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const target = event.target as HTMLInputElement | HTMLTextAreaElement;
        if ('select' in target) {
            target.select();
        }
    }

    const onBlurInput = (quantity: string) => {
        const numericValue = Number(quantity);
        if (numericValue === remainingQuantity) return;

        if (isValidField(quantity) && !isNaN(numericValue) && numericValue !== 0) {

            setQuantity(() => numericValue);
            console.log(numericValue)
            if (numericValue <= item.remainingQuantityReal) {
                changeInputQuantity(numericValue)
            } else {
                setQuantity(remainingQuantity);
            }
        } else {
            setQuantity(remainingQuantity);
        }
    }

    // Memoize the callback using useCallback
    const memoizedCallback = useCallback(
        (newQuantity: number) => {
            setQuantity(newQuantity);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [remainingQuantity]
    );

    useEffect(() => {
        // Call the memoized callback when the local quantity changes
        memoizedCallback(Number(remainingQuantity));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderDivideItems, memoizedCallback]);

    return (
        <InputBase
            value={quantity}
            sx={{
                ml: 1,
                flex: 1,
                width: 'auto', // Adjusted for flexibility
                fontSize: '1.2rem',
                height: 'calc(1.1em + 0.75rem + 2px)',
                border: 'none',
                outline: 'none',
                padding: '0.375rem 0.75rem',
                '& input': {
                    textAlign: 'center',
                    fontSize: '1.2rem', // Consistent font size
                },
            }}
            inputProps={{
                'aria-label': '0',
                onFocus: handleFocus,
                onClick: handleFocus,
                onBlur: (e) => onBlurInput(e.target.value)
            }}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0"
        />
    )
}

export default InputRemainingQuantity