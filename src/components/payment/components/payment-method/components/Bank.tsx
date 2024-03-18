
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';  
import { usePaymentStore } from '@/store/payment/paymentStore.';

export default function Bank() {
    const { dataForm, setChangeFieldFormPayment } = usePaymentStore(state => state);
    const { banks } = dataForm;  

    return (
        <>
            {
                banks.length > 0 && (
                    <Autocomplete
                        fullWidth
                        disablePortal
                        id="banco" 
                        onChange={(_, newValue) => { 
                            const bankId = newValue? newValue.bankId : 0  
                            setChangeFieldFormPayment("idBanco", bankId)     
                          }}
                        options={banks}
                        getOptionLabel={(option) => option.description}
                        renderInput={(params) => <TextField {...params} label="Banco" />}
                    />
                )
            }
        </>
    );
}
