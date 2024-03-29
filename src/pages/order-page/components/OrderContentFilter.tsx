import CustomDateRange from '@/components/common/CustomDateRange'
import { RefreshIcon } from '@/components/common/IconsMaterial'
import CompanyCustomerSearch from '@/components/company-customer/CompanyCustomerSearch'
import { useOrderStore } from '@/store/order/order.slice'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import TableSelectFilter from './filter/TableSelectFilter'
import UserSelectfilter from './filter/UserSelectfilter'

const OrderContentFilter = () => {
    const { 
        establecimientos, 
        puntosEmision,
        users,
        tables,
        dataFilter,
        onChangeDateRange, 
        setChangeFieldFilter, 
        getOrders 
    } = useOrderStore(state => state);

    function getDataCustomer(data?: unknown) {
        let customerCompanyId = 0;
        if (data !== null && typeof data === 'object' && ("idCliente" in data)) {
            customerCompanyId = data.idCliente as number;
        }
        setChangeFieldFilter("customerCompanyId", customerCompanyId)
    }

    return (
        <>

            <Grid container >
                <Grid item xs={5} alignSelf="center">
                    <Typography variant="h6" display="block" gutterBottom >
                        Ordenes
                    </Typography>
                </Grid>
                <Grid item xs={7} alignSelf="center" textAlign="end">
                    <Button color="info" variant="contained"   >
                        Nuevo
                    </Button>
                </Grid>
            </Grid>

            <Grid container m={1} spacing={1}>
                <Grid item xl={4} lg={4} md={4} sm={4} xs={12} alignSelf="center">
                    {establecimientos.length > 0 && <TextField fullWidth
                        id="establecimientos"
                        name="establecimientos"
                        label="Establecimiento"
                        size='small'
                        select
                        value={dataFilter.codEstab}
                    >
                        {
                            establecimientos.map((item, index) => (
                                <MenuItem value={item.codEstab} key={index}>
                                    {item.nombreComercial}
                                </MenuItem>
                            ))
                        }
                    </TextField>
                    }
                </Grid>
                <Grid item xl={3} lg={3} md={4} sm={4} xs={12} alignSelf="center">
                    <CustomDateRange onChangeDateRange={onChangeDateRange} />
                </Grid>
                <Grid item xl={4} lg={4} md={4} sm={4} xs={12} alignSelf="center">
                    <CompanyCustomerSearch basic={true} callbackfn={getDataCustomer} />
                </Grid>
                <Grid item>
                    <Stack direction="row" spacing={0} width={50}>
                        {/* <IconButton color='primary' onClick={refresh}>
                  <VisibilityIcon />
                </IconButton> */}
                        <Tooltip title="Recargar">
                            <IconButton color='info' onClick={getOrders}>
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Grid>
            </Grid>
            <Grid container m={1} spacing={1}>

                <Grid item xl={2} lg={2} md={4} sm={4} xs={12} alignSelf="center">
                    {puntosEmision.length > 0 && <TextField fullWidth
                        id="puntosEmision"
                        name="puntosEmision"
                        label="Punto Emisión"
                        size='small'
                        select
                        value={dataFilter.idPuntoEmision || ''}
                        onChange={(e) => setChangeFieldFilter("idPuntoEmision", Number(e.target.value))}
                    >
                        {
                            puntosEmision.map((item, index) => (
                                <MenuItem value={item.idPuntoEmision} key={index}>
                                    {item.ptoEmi}
                                </MenuItem>
                            ))
                        }
                    </TextField>
                    }
                </Grid>
                <Grid item xl={2} lg={2} md={4} sm={4} xs={12} alignSelf="center">
                    <UserSelectfilter
                        onChange={(e) => setChangeFieldFilter("userId", Number(e.target.value))}
                        value={dataFilter.userId.toString()}
                        users={users} />
                </Grid>
                <Grid item xl={2} lg={2} md={4} sm={4} xs={12} alignSelf="center">
                    <TableSelectFilter
                        tables={tables}
                        onChange={(value) => setChangeFieldFilter("tableId", value)}
                        value={dataFilter.userId.toString()}
                    />
                </Grid>
                <Grid item xl={4} lg={4} md={4} sm={4} xs={12} >
                    <FormControl>
                        <RadioGroup row
                            name="tipoOrden"
                            value={dataFilter.tipoOrden}
                            onChange={(e) => setChangeFieldFilter("tipoOrden", e.target.value)}
                        >
                            <FormControlLabel value={"SD"} control={<Radio />} label="Sin Doc." />
                            <FormControlLabel value={"CD"} control={<Radio />} label="Con Doc." />
                        </RadioGroup>
                    </FormControl>
                </Grid>
            </Grid>
        </>

    )
}

export default OrderContentFilter