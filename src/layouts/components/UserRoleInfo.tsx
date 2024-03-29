import { GroupedEstab, GroupedEstabBodega, GroupedEstabPuntoEmision } from '@/models/estab.model'
import { configSvc } from '@/services/config.service'
import { getDataEstab, getUserData } from '@/services/persist-user.service'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Popover from '@mui/material/Popover'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'

const UserRoleInfo = () => {
    const [estabs, setEstabs] = useState<GroupedEstab[]>([]);
    const [dataEstab, setDataEstab] = useState<GroupedEstab>({} as GroupedEstab);
    const [puntosEmision, setPuntosEmision] = useState<GroupedEstabPuntoEmision[]>([])
    const [dataPuntoEmision, setDataPuntoEmision] = useState<GroupedEstabPuntoEmision>({} as GroupedEstabPuntoEmision);
    const [bodegas, setBodegas] = useState<GroupedEstabBodega[]>([])
    const [dataBodega, setDataBodega] = useState<GroupedEstabBodega>({} as GroupedEstabBodega)


    const userData = getUserData()
    useEffect(() => {
        configSvc.getMainDataEstab().then(response => {
            const tempDataEstab = response.find(e => e.codEstab === getDataEstab().codEstab)
            setEstabs(response);
            if (tempDataEstab) {
                const tempDataPuntoEmision = tempDataEstab.puntosEmision.find(p => p.defaultPtoEmi);
                if (tempDataPuntoEmision) {
                    setDataPuntoEmision(tempDataPuntoEmision)
                }
                const tempDataBodega = tempDataEstab.bodegas.find(b => b.defaultBodega)
                setPuntosEmision(tempDataEstab.puntosEmision)
                setDataEstab(tempDataEstab);
                setBodegas(tempDataEstab.bodegas);
                if (tempDataBodega) {
                    setDataBodega(tempDataBodega)
                }
            }
        })
    }, [])

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);


    const handleClick = (event: React.MouseEvent) => {
        setAnchorEl(event.currentTarget as HTMLButtonElement);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <>
            <Box sx={{ flexGrow: 1, display: { xs: 'block', md: 'flex', justifyContent: 'start' }, justifyContent: 'end' }}>
                <Stack onClick={(e) => handleClick(e)} style={{ cursor: 'pointer' }}>
                    <Typography variant="body2" >
                        Estab: {dataEstab?.nombreComercial}
                    </Typography>
                    <Typography variant="body2" >
                        Punto Emisión:{dataPuntoEmision.ptoEmi}
                    </Typography>
                    <Typography variant="body2">
                        <span>Usuario: {userData.username}</span>
                    </Typography>
                </Stack>
            </Box>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                {/* Use Paper component to control width */}
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', minWidth: 280, maxWidth: 280, gap: 1, p: 1 }}>
                    {
                        puntosEmision && puntosEmision.length > 0 && (
                            <FormControl fullWidth size="small" disabled>
                                <InputLabel size='small' id="puntoEmision">
                                    Punto Emisión
                                </InputLabel>
                                <Select
                                    labelId="puntoEmision"
                                    id="puntoEmision-select-small"
                                    label="Punto Emisión"
                                    value={dataPuntoEmision?.idPuntoEmision}
                                >
                                    {
                                        puntosEmision.map((pt, index) => (
                                            <MenuItem key={index} value={pt.idPuntoEmision}>{pt.ptoEmi}</MenuItem>
                                        ))
                                    }

                                </Select>
                            </FormControl>
                        )
                    }

                    {
                        bodegas && bodegas.length > 0 && (
                            <FormControl fullWidth size="small" disabled>
                                <InputLabel id="bodega">Bodega</InputLabel>
                                <Select
                                    labelId="bodega"
                                    id="bodega-select-small"
                                    label="Bodega"
                                    value={dataBodega?.idBodega}
                                >
                                    {
                                        bodegas.map((bodega, index) => (
                                            <MenuItem key={index} value={bodega.idBodega}>{bodega.descripcion}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        )
                    }
                </Box>
            </Popover>
        </>
    )
}

export default UserRoleInfo