import CustomDateRange from '@/components/common/CustomDateRange';
import { ClearIcon, InsertDriveFileIcon, MenuIcon, PointOfSaleIcon, RefreshIcon } from '@/components/common/IconsMaterial';
import PaginationCustom from '@/components/common/PaginationCustom';
import CompanyCustomerSearch from '@/components/company-customer/CompanyCustomerSearch';
import PrimaryStatusTable from '@/components/ui/PrimaryStatusTable'
import { StyledTableCell } from '@/components/ui/StyledTableCell';
import { useDialog } from '@/context/DialogProvider';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@/models/estab.model';
import { OrderRead } from '@/models/order.model';
import { TableOrderFilter } from '@/models/table.model';
import { UserSelectHtmlOnly } from '@/models/user.model';
import { orderSvc } from '@/services/order.service';
import { getDataEstab } from '@/services/persist-user.service';
import { formatDateMoment } from '@/utils/format-date-moment';
import { hideLoader, showLoader } from '@/utils/loader';
import { isValidField } from '@/utils/utils';
import ModeTwoToneIcon from '@mui/icons-material/ModeTwoTone';
import { Button, Card, CardContent, FormControl, FormControlLabel, Grid, IconButton, Menu, MenuItem, Paper, Radio, RadioGroup, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import { produce } from 'immer';
import { useEffect, useState } from 'react';

import Divide from './components/divide/Divide';
import OrderDoc from './components/OrderDoc';
import TableSelectFilter from './components/TableSelectFilter';
import UserSelectfilter from './components/UserSelectfilter';

const Order = () => {
  const [openDialog, closeDialog,] = useDialog();


  const [establecimientos, setEstablecimientos] = useState<Array<GroupedEstab>>([])
  const [puntosEmision, setPuntosEmision] = useState<Array<GroupedEstabPuntoEmision>>([])
  const [tables, setTables] = useState<Array<TableOrderFilter>>([])
  const [users, setUsers] = useState<Array<UserSelectHtmlOnly>>([])
  const [orders, setOrders] = useState<Array<OrderRead>>([]);

  //Opciones 
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [dataSearch, setDataSearch] = useState({
    tableId: 0,
    pageIndex: 1,
    pageSize: 25,
    fromDate: formatDateMoment(new Date()),
    toDate: formatDateMoment(new Date()),
    customerCompanyId: 0,
    codEstab: '',
    idPuntoEmision: 0,
    userId: 0,
    tipoOrden: "SD"
  })

  function setChangeFieldFilter<T extends keyof typeof dataSearch>(
    prop: T,
    value: typeof dataSearch[T]
  ) {
    setDataSearch(
      produce((state) => {
        state[prop] = value;
      })
    )
  }
  const getOrders = () => {
    showLoader();
    const params = {
      pageIndex: dataSearch.pageIndex,
      pageSize: dataSearch.pageSize,
      startDate: dataSearch.fromDate,
      endDate: dataSearch.toDate,
      customerCompanyId: isValidField(dataSearch.customerCompanyId),
      tableId: isValidField(dataSearch.tableId),
      userId: isValidField(dataSearch.userId),
      puntoEmisionId: isValidField(dataSearch.idPuntoEmision),
      finished: dataSearch.tipoOrden === 'CD'
    }
    orderSvc.getAll(params).then(response => {
      console.log(response)
      if (response) {
        setOrders(response)
      }
    }).catch((error) => console.log(error))
      .finally(() => hideLoader())
  }

  const getDataFilter = () => {
    try {
      const codEstab = getDataEstab().codEstab;
      orderSvc.getDataFilter({}).then(response => {
        const { tables, users, establecimientos } = response;
        const tempEstabs = establecimientos.filter(e => e.codEstab === codEstab);

        setTables(tables);
        setUsers(users);
        setEstablecimientos(tempEstabs)
        const dataEstab = establecimientos.find(e => e.codEstab === codEstab);
        if (dataEstab) {
          setPuntosEmision(dataEstab.puntosEmision);
          const dataPuntoEmision = dataEstab.puntosEmision.find(p => p.defaultPtoEmi);
          if (dataPuntoEmision) {
            // setChangeFieldFilter("idPuntoEmision", dataPuntoEmision.idPuntoEmision)
            // setChangeFieldFilter("codEstab", codEstab)
            setDataSearch(state => ({
              ...state,
              codEstab,
              idPuntoEmision: dataPuntoEmision.idPuntoEmision
            })
            )
          }
          dataEstab.puntosEmision
        }
      })
    } catch (error) {
      console.log(error)

    }
  }
  useEffect(() => {
    getDataFilter()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (isValidField(dataSearch.codEstab) && dataSearch.idPuntoEmision > 0) {
      getOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSearch]);


  function onChangeDateRange<T extends { from: string, to: string }>({ from, to }: T) {
    setDataSearch(
      produce((state) => {
        state["fromDate"] = from;
        state["toDate"] = to;
      }
      ))
  }

  function openModalDoc(id: number, data: OrderRead) {
    openDialog({
      maxWidth: 'md',
      children: <OrderDoc id={id} data={data} close={() => closeDialog()} />,
    })
  }

  const setPageIndex = (pageIndex: number) => {
    setChangeFieldFilter("pageIndex", pageIndex);
  }

  function getDataCustomer(data?: unknown) {
    let customerCompanyId = 0;
    if (data !== null && typeof data === 'object' && ("idCliente" in data)) {
      customerCompanyId = data.idCliente as number;
    }
    setChangeFieldFilter("customerCompanyId", customerCompanyId)
  }

  const refresh = () => {
    getOrders();
  }

  const openModalDivide = (item: OrderRead) => {
    console.log(item)
    openDialog({
      maxWidth: "lg",
      fullScreen: true,
      children: <Divide close={closeDialog} orderId={item.id} />,
    })
  }

  const btnDivided = (order: OrderRead) => {
    if (order.finished) return

    if (order.divided && order.finished) return
    // if (order.divided && order.finished === false) return

    return (
      <MenuItem onClick={() => openModalDivide(order)}>
        <PointOfSaleIcon color='primary' />
        Completar venta
      </MenuItem>
    )
  }

  const optionMenu = (item: OrderRead) => {
    return <>
      <TableCell component="th" scope="row">
        <IconButton
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <MenuIcon />
        </IconButton>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={() => openModalDoc(item.id, item)}>
            <InsertDriveFileIcon color='info' />
            Docs.
          </MenuItem>
          <MenuItem  >
            <ModeTwoToneIcon color='success' />
            Editar
          </MenuItem>
          {btnDivided(item)}
          <MenuItem  >
            <ClearIcon color='error' />
            Anular
          </MenuItem>
        </Menu>

      </TableCell>

    </>
  }

  return (
    <Card>
      <CardContent>
        <Grid container>
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
                value={dataSearch.codEstab}
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
                  <IconButton color='info' onClick={refresh}>
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
                value={dataSearch.idPuntoEmision || ''}
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
                value={dataSearch.userId.toString()}
                users={users} />
            </Grid>
            <Grid item xl={2} lg={2} md={4} sm={4} xs={12} alignSelf="center">
              <TableSelectFilter
                tables={tables}
                onChange={(value) => setChangeFieldFilter("tableId", value)}
                value={dataSearch.userId.toString()}
              />
            </Grid>
            <Grid item xl={4} lg={4} md={4} sm={4} xs={12} >
              <FormControl>
                <RadioGroup row
                  name="tipoOrden"
                  value={dataSearch.tipoOrden}
                  onChange={(e) => setChangeFieldFilter("tipoOrden", e.target.value)}
                >
                  <FormControlLabel value={"SD"} control={<Radio />} label="Sin Doc." />
                  <FormControlLabel value={"CD"} control={<Radio />} label="Con Doc." />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>


          <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 400 }}>
            <Table stickyHeader size="small">
              <TableHead >
                <TableRow>
                  <StyledTableCell>Op.</StyledTableCell>
                  <StyledTableCell>N°.</StyledTableCell>
                  <StyledTableCell>Nro. Documento</StyledTableCell>
                  <StyledTableCell>Fecha Emisión</StyledTableCell>
                  <StyledTableCell>Cliente</StyledTableCell>
                  <StyledTableCell>Total</StyledTableCell>
                  <StyledTableCell>Mesa</StyledTableCell>
                  <StyledTableCell>Usuario</StyledTableCell>
                  <StyledTableCell>Estado</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  orders.map((item, index) => (
                    <TableRow key={index}>
                      {optionMenu(item)}
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.serie}</TableCell>
                      <TableCell>{item.createdAt}</TableCell>
                      <TableCell>{item.razonSocialComprador}</TableCell>
                      <TableCell>${item.total}</TableCell>
                      <TableCell>{item.tableName}</TableCell>
                      <TableCell>{item.userName}</TableCell>
                      <TableCell>
                        <PrimaryStatusTable status={item.enabled} />
                      </TableCell>
                    </TableRow>
                  ))
                }
                {
                  orders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} align='center'>
                        No hay datos
                      </TableCell>
                    </TableRow>
                  )
                }

              </TableBody>
            </Table>
          </TableContainer>
          <Grid mt={3}>

            <PaginationCustom
              items={orders}
              totalRecords={orders.length > 0 ? orders[0].totalRecords : 0}
              pageSize={dataSearch.pageSize}
              setPageIndex={setPageIndex}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Order