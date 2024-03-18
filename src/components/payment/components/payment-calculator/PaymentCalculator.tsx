import { Box, Grid } from '@mui/material';
import CalculatorButton from './CalculatorButton';
import { addSound, clearSound } from '@/utils/sound.util';
import { BackspaceIcon } from '@/components/common/IconsMaterial';
import { usePaymentStore } from '@/store/payment/paymentStore.';
import { useRef } from 'react';

const grids = [7, 8, 9, 4, 5, 6, 1, 2, 3, ".", 0]


export default function PaymentCalculator() {
    const { calculatorOnClickBtnClear, calculatorOnClickButton, calculatorOnCickOptionDollar } = usePaymentStore(state => state);

    const ultimoBotonClickeado = useRef<number | null>(null)
    const total = useRef(0);

    const onClickCalculatorButton = (value: number | string) => {
        ultimoBotonClickeado.current = 0;
        total.current = 0;
        addSound();
        calculatorOnClickButton(value)
    }

    const onClickClearButton = () => {
        ultimoBotonClickeado.current = 0;
        total.current = 0;
        calculatorOnClickBtnClear()
        clearSound();
    }
    const onClickOption = (valor: number) => {
        if (ultimoBotonClickeado.current === valor) {
            total.current += valor;
        } else {
            ultimoBotonClickeado.current = valor;
            total.current = valor;
        }

        calculatorOnCickOptionDollar(total.current)
        addSound();
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 12, sm: 12, md: 12 }}>
                <Grid item xs={4} sm={4} md={4} >
                    <CalculatorButton onClick={() => onClickOption(5)}>$5</CalculatorButton>
                </Grid>
                <Grid item xs={4} sm={4} md={4} >
                    <CalculatorButton onClick={() => onClickOption(10)}>$10</CalculatorButton>
                </Grid>
                <Grid item xs={4} sm={4} md={4} >
                    <CalculatorButton onClick={() => onClickOption(20)}>$20</CalculatorButton>
                </Grid>
                {
                    grids.map((value, index) => (
                        <Grid item xs={4} sm={4} md={4} key={index}>
                            <CalculatorButton onClick={() => onClickCalculatorButton(value)}>{value}</CalculatorButton>
                        </Grid>
                    ))
                }
                <Grid item xs={4} sm={4} md={4}>
                    <CalculatorButton onClick={onClickClearButton}>
                        <BackspaceIcon />
                    </CalculatorButton>
                </Grid>

            </Grid>
        </Box>
    )
}
