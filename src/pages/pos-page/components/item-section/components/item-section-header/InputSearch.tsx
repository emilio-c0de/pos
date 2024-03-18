import { LoyaltyIcon, SyncIcon } from '@/components/common/IconsMaterial'
import { usePosStore } from '@/store/pos/posStore'
import { Divider, IconButton, InputBase, Paper, Tooltip } from '@mui/material'
import { pink } from '@mui/material/colors'

const InputSearch = () => {
    const filterItems = usePosStore.itemStore(state => state.filterItems)
    return (
        <Paper elevation={0}
            component="form"
            sx={{ display: 'flex', alignItems: 'center', width: "100%", borderRadius: 5 }}
        >
            <Tooltip title="Promociones">
                <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions">
                    <LoyaltyIcon />
                </IconButton>
            </Tooltip>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <Tooltip title="Refrescar">
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                    <SyncIcon sx={{ color: pink[500] }} />
                </IconButton>
            </Tooltip>

            <InputBase size='small'
                onChange={(e) => filterItems(e.target.value)}
                sx={{
                    ml: 2, flex: 1, '& input': {
                        //textAlign: 'center', // Texto centrado
                    },
                }}
                placeholder="Buscar item"
                inputProps={{ 'aria-label': 'Buscar item' }}
            />


        </Paper>
    )
}

export default InputSearch