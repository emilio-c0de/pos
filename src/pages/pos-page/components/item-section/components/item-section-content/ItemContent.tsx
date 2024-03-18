import { ProductionQuantityLimitsIcon, SyncProblemIcon } from '@/components/common/IconsMaterial';
import { usePosStore } from '@/store/pos/posStore';
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow';

import ItemList from './ItemList';
import ItemListSkeleton from './ItemListSkeleton';

const ItemContent = () => {
    const itemStore = usePosStore.itemStore(useShallow(state => state));
    const { loading, error, items } = itemStore;


    useEffect(() => {
        itemStore.fetchItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemStore.dataSearch])

    const renderContentEmptyError = (icon: JSX.Element, message: string) => (
        <Stack direction="column" justifyContent="center" alignItems="center" spacing={2} height="50vh">
            {icon}
            <Typography>{message}</Typography>
        </Stack>
    );

    const renderErrorContent = (icon: JSX.Element) => !loading && error && renderContentEmptyError(icon, error);

    const renderNoResultsContent = (icon: JSX.Element) => !loading && !error && items.length === 0 && renderContentEmptyError(icon, "No se encontró los resultados!");

    const renderContent = () => {
        return !error && (<Grid container spacing={2} columns={{ xs: 4, sm: 9, md: 12, lg: 16 }}>
            {loading && <ItemListSkeleton />}
            {!loading && items.length > 0 && <ItemList />}
        </Grid>)
    }


    return (
        <Box marginTop={2} sx={{
            my: 1,
            height: "60vh", // Ajusta la altura según tus necesidades
            overflow: 'auto', // Agrega el scroll si el contenido excede la altura 
            // Consulta de medios para tamaños de pantalla más pequeños
            alignItems: 'center',
            '@media (max-width: 600px)': {
                height: '100vh', // Altura reducida para pantallas más pequeñas
            },
            pb: 1
        }}>

            {renderErrorContent(
                <SyncProblemIcon color="error" sx={{ height: "5rem!important", width: '5rem', color: 'rgba(59, 130, 246, 0.5)' }} />
            )}

            {renderNoResultsContent(
                <ProductionQuantityLimitsIcon color="info" sx={{ height: "5rem!important", width: '5rem', color: 'rgba(59, 130, 246, 0.5)' }} />
            )}

            {renderContent()}

        </Box>
    )
}

export default ItemContent