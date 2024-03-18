// import { useTypedSelector } from '@/store/hooks'
// import { Box, FormControl, InputLabel, MenuItem, Popover, Select } from '@mui/material'
// import { FC } from 'react'

// interface UserRoleInfoProps {
//     open: boolean
//     id: string | undefined
//     anchorEl: HTMLButtonElement | null
//     handleClose(): void
// }
// const UserRoleInfo: FC<UserRoleInfoProps> = ({ open, id, anchorEl, handleClose }) => {
//     const { dataForm } = useTypedSelector(store => store.shop);

//     const { establecimientos } = dataForm;

//     const dataEstab = establecimientos.find(estab => (estab.defaultEstab));
//     const puntosEmision = dataEstab && dataEstab.puntosEmision || [];
//     const bodegas = dataEstab && dataEstab.bodegas || [];
//     const dataPuntoEmision = puntosEmision.find(pe => (pe.defaultPtoEmi))
//     const dataBodega = bodegas.find(b => (b.defaultBodega))
//     return (
//         <Popover
//             id={id}
//             open={open}
//             anchorEl={anchorEl}
//             onClose={handleClose}
//             anchorOrigin={{
//                 vertical: 'bottom',
//                 horizontal: 'left',
//             }}
//         >
//             {/* Use Paper component to control width */}
//             <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', minWidth: 280, maxWidth: 280, gap: 1, p: 1 }}>
//                 {
//                     puntosEmision && puntosEmision.length > 0 && (
//                         <FormControl fullWidth size="small" disabled>
//                             <InputLabel size='small' id="puntoEmision">
//                                 Punto Emisión
//                             </InputLabel>
//                             <Select
//                                 labelId="puntoEmision"
//                                 id="puntoEmision-select-small"
//                                 label="Punto Emisión"
//                                 value={dataPuntoEmision?.idPuntoEmision}
//                             >
//                                 {
//                                     puntosEmision.map((pt, index) => (
//                                         <MenuItem key={index} value={pt.idPuntoEmision}>{pt.ptoEmi}</MenuItem>
//                                     ))
//                                 }

//                             </Select>
//                         </FormControl>
//                     )
//                 }

//                 {
//                     bodegas && bodegas.length > 0 && (
//                         <FormControl fullWidth size="small" disabled>
//                             <InputLabel id="bodega">Bodega</InputLabel>
//                             <Select
//                                 labelId="bodega"
//                                 id="bodega-select-small"
//                                 label="Bodega"
//                                 value={dataBodega?.idBodega}
//                             >
//                                 {
//                                     bodegas.map((bodega, index) => (
//                                         <MenuItem key={index} value={bodega.idBodega}>{bodega.bodega}</MenuItem>
//                                     ))
//                                 }
//                             </Select>
//                         </FormControl>
//                     )
//                 }
//             </Box>
//         </Popover>
//     )
// }

// export default UserRoleInfo