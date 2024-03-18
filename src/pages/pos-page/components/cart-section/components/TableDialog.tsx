import { TableRestaurantIcon } from "@/components/common/IconsMaterial";
import DialogHeader from "@/components/ui/DialogHeader"
import { Floor } from "@/models/floor.model";
import { Room } from "@/models/room.model";
import { Table } from "@/models/table.model";
import { configSvc } from "@/services/config.service";
import { getDataEstab } from "@/services/persist-user.service";
import { tableSvc } from "@/services/table.service";
import { usePosStore } from "@/store/pos/posStore"
import { DataPopulatedFloorRoomTable } from "@/store/pos/types";
import { hideLoader, showLoader } from "@/utils/loader";
import { notify, ToastType } from "@/utils/toastify/toastify.util";
import { Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow"

type TableDialogProps = {
  close(): void
}
const TableDialog = ({ close }: TableDialogProps) => {
  const cartStore = usePosStore.cartStore(useShallow(state => state));
  const sharedStore = usePosStore.sharedStore(useShallow(state => state));
  const order = cartStore.order;
  console.log(order)
  const [floors, setFloors] = useState<Array<Floor>>([]);
  const [floorId, setFloorId] = useState(0);

  const [roomId, setRoomId] = useState(0);
  const [rooms, setRooms] = useState<Array<Room>>([]);

  const dataPopulatedFloorRoomTable = useRef({} as DataPopulatedFloorRoomTable)
  const tableId = useRef(order.tableId);
  const tableName = useRef(order.tableName);
  const [tables, setTables] = useState<Array<Table>>([]);



  const onChangeFloor = (floorId: number) => {
    const filteredRooms = Object.values(dataPopulatedFloorRoomTable.current.rooms).filter(room => room.floorId === floorId);
    const tempRoom = filteredRooms[0];
    const tempTables = tempRoom ? Object.values(dataPopulatedFloorRoomTable.current.tables).filter(table => table.roomId === tempRoom.id) : [];
    const tempTable = tempTables[0];

    setFloorId(floorId);
    setRooms(filteredRooms);
    setRoomId(tempRoom ? tempRoom.id : 0);

    setTables(tempTables);
    tableId.current = tempTable ? tempTable.id : 0;
    tableName.current = tempTable ? `${tempRoom.description} - ${tempTable.description}` : '';
  }

  const onChangeRoom = (roomId: number) => {
    const tempTables = Object.values(dataPopulatedFloorRoomTable.current.tables).filter(table => table.roomId === roomId);
    const tempRoom = dataPopulatedFloorRoomTable.current.rooms[roomId];

    setRoomId(roomId);
    setTables(tempTables);
    tableId.current = tempTables[0]?.id || 0;
    tableName.current = `${tempRoom?.description ?? ''} - ${tempTables[0]?.description ?? ''}`;
  }



  const getDataTable = () => {
    const codEstab = getDataEstab();
    showLoader();
    configSvc.getDataForm(codEstab).then(response => {
      if (response) {
        dataPopulatedFloorRoomTable.current = response.dataPopulatedFloorRoomTable;
        setFloors(() => Object.values(dataPopulatedFloorRoomTable.current.floors))

        if (tableId.current > 0) {
          const dataTable = dataPopulatedFloorRoomTable.current.tables[order.tableId]
          if (dataTable) {
            const tempRooms = Object.values(dataPopulatedFloorRoomTable.current.rooms).filter(item => item.floorId === dataTable.floorId);
            const tempTables = Object.values(dataPopulatedFloorRoomTable.current.tables).filter(item => item.roomId === dataTable.roomId);

            setRoomId(() => dataTable.roomId);
            setFloorId(() => dataTable.floorId);
            setRooms(() => tempRooms)
            setTables(() => tempTables)
            tableId.current = order.tableId;
          }
        }

      }
      hideLoader();
    }).catch(error => {
      console.log(error)
    }).finally(() => hideLoader());
  }
  useEffect(() => {
    getDataTable();

    return () => {
      sharedStore.setDataPopulatedFloorRoomTable(dataPopulatedFloorRoomTable.current);
      console.log(tableId.current)
      if (tableId.current > 0 && tableName.current) {
        console.log('clicckckckkdkjhdkj')
        cartStore.setUpdateOrderData({
          tableId: tableId.current,
          tableName: tableName.current
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const putStateAssigned = async (obj: Table) => {
    try {
      // const { isConfirmed } = await Swal.fire({
      //     icon: 'warning',
      //     html: 'Esta seguro de liberar la mesa?',
      //     showCancelButton: true,
      //     confirmButtonColor: '#3085d6',
      //     cancelButtonColor: '#d33',
      //     confirmButtonText: 'Si!',
      //     cancelButtonText: 'No!'
      // })
      // if (isConfirmed) {
      showLoader();
      tableSvc.putStateAssigned(obj.id, {
        id: obj.id,
        description: obj.description,
        roomId: obj.roomId,
        assigned: false
      }).then(response => {
        if (response.status === 200) {
          tableId.current = obj.id
          getDataTable();
          notify({
            type: ToastType.Success,
            content: response.data
          })
        }

      }).finally(() => hideLoader())
      // }
    } catch (error) {
      console.log(error)
    }
  }

  const selectedTable = (data: Table) => {
    const dataRoom = dataPopulatedFloorRoomTable.current.rooms[data.roomId];
    tableId.current = data.id;
    tableName.current = `${dataRoom?.description} - ${data.description}`
    close()
  }

  return (
    <>
      <DialogHeader title='Mesas' close={() => close()} />
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            {
              floors.length > 0 && (
                <TextField
                  id="floors"
                  select
                  label="PISOS"
                  value={floorId || ''}
                  size='small'
                  fullWidth
                  onChange={(e) => onChangeFloor(Number(e.target.value))}
                >
                  {
                    floors.map((item, index) => (
                      <MenuItem key={index} value={item.id} >
                        {item.description}
                      </MenuItem>
                    ))
                  }
                </TextField>
              )
            }
          </Grid>
          <Grid item xs={6}>
            {
              rooms.length > 0 && (
                <TextField
                  id="rooms"
                  select
                  label="SALAS"
                  value={roomId || ''}
                  size='small'
                  fullWidth
                  onChange={(e) => onChangeRoom(Number(e.target.value))}
                >
                  {
                    rooms.map((item, index) => (
                      <MenuItem key={index} value={item.id} >
                        {item.description}
                      </MenuItem>
                    ))
                  }
                </TextField>
              )
            }
          </Grid>


          <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {
              tables.map((item, index) => (
                <Card sx={{ minWidth: 160, flexBasis: '30%' }} key={index} elevation={4} >
                  <CardContent>
                    <Stack direction="column" alignContent="center" alignItems="center">
                      <TableRestaurantIcon fontSize="large" color="primary" />
                      <Typography>{item.description}</Typography>
                    </Stack>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center' }}>
                    {
                      item.assigned && (
                        <Button size="small" variant="outlined" color="warning" onClick={() => putStateAssigned(item)}>Liberar</Button>
                      )
                    }
                    {
                      item.assigned ? '' : (
                        <Button size="small"
                          variant="outlined"
                          disabled={tableId.current === item.id ? true : false}
                          onClick={() => selectedTable(item)}
                        >
                          {tableId.current === item.id ? 'Seleccionado' : 'Seleccionar'}
                        </Button>
                      )
                    }
                  </CardActions>
                </Card>
              ))
            }
          </Box>

        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color='inherit' variant='outlined' size='large' fullWidth onClick={() => close()}>
          Cerrar
        </Button>
      </DialogActions>
    </>
  )
}

export default TableDialog