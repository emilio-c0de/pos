 
import Box from '@mui/material/Box'; 
import Grid from '@mui/material/Grid'; 
import Typography from '@mui/material/Typography';
import { Card } from '@mui/material';  
import { usePaymentStore } from '@/store/payment/paymentStore.';

const PaymentInfo = () => { 
    const paymentStore = usePaymentStore(state=>state);
    const {dataForm} = paymentStore;
    const {comprobante} = dataForm;
    return (
        <Card variant="outlined"  >
            <Box sx={{ p: 2 }}>
                <Grid container alignItems="center">                    
                    <Grid item xs>
                        <Typography gutterBottom fontWeight={700} component="div">
                            Nro. Documento:
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography gutterBottom variant="body2" component="div">
                            {comprobante.serieComprobante}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container alignItems="center">                    
                    <Grid item xs>
                        <Typography gutterBottom fontWeight={700} component="div">
                            Cliente:
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography gutterBottom variant="body2" component="div">
                            {comprobante.razonSocialComprador}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container alignItems="center">                    
                    <Grid item xs>
                        <Typography gutterBottom fontWeight={700} component="div">
                            Numero Identificación:
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography gutterBottom variant="body2" component="div">
                        {comprobante.identificacionComprador}
                        </Typography>
                    </Grid>
                </Grid> 
            </Box> 
        </Card>
    )
}

export default PaymentInfo;
