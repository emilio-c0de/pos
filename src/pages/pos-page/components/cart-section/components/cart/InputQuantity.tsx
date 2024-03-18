import { OrderItem } from "@/models/order.model"
import { usePosStore } from "@/store/pos/posStore"
import { isValidField } from "@/utils/utils"
import InputBase from "@mui/material/InputBase"
import { useCallback, useEffect, useState } from "react"
import { useShallow } from "zustand/react/shallow"

type InputQuantityProps = {
    item: OrderItem
    changeInputQuantity(newQuantity: number): void
}
const InputQuantity = ({ item, changeInputQuantity }: InputQuantityProps) => {
    const cartStore = usePosStore.cartStore(useShallow(state => state));
    const items = cartStore.order.items;
    const [quantity, setQuantity] = useState<number | string>(item.quantity);

    const handleChange = (value: string | number) => {
        console.log(value)
        setQuantity(() => value)
    }

    // Memoize the callback using useCallback
    const memoizedCallback = useCallback(
        (newQuantity: number) => {
            setQuantity(newQuantity);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [item.quantity]
    );

    useEffect(() => {
        // Call the memoized callback when the local quantity changes
        memoizedCallback(Number(item.quantity));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items, memoizedCallback]);


    const handleFocus = (
        event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement> | React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const target = event.target as HTMLInputElement | HTMLTextAreaElement;
        // Check if 'select' property exists before using it
        if ('select' in target) {
            // Use 'select' property
            target.select();
        }
    }

    const onBlurInput = (quantity: string) => {
        const numericValue = Number(quantity);
        console.log(numericValue)
        if (isValidField(quantity) && !isNaN(numericValue) && numericValue !== 0) {

            setQuantity(() => numericValue);
            if(numericValue!==item.quantity){
                changeInputQuantity(numericValue) 
            }
        } else {
            setQuantity(item.quantity);
        }
    }

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
            onChange={(e) => handleChange(e.target.value)}
            placeholder="0"
        />
    )
}

export default InputQuantity