import { useDialog } from '@/context/DialogProvider';
import { usePosStore } from '@/store/pos/posStore';
import Button from '@mui/material/Button'
import { useShallow } from 'zustand/react/shallow';

import TableDialog from './TableDialog';

function TableButton() {
    const cartStore = usePosStore.cartStore(useShallow(state => state))
    const [openDialog, closeDialog] = useDialog();

    const openTableDialog = () => {
        openDialog({
            maxWidth: 'sm',
            scroll: 'body',
            children: <TableDialog close={closeDialog} />
        })
    }
    return (
        <Button variant="outlined" fullWidth onClick={() => openTableDialog()} >
            {cartStore.order.tableId > 0 ? cartStore.order.tableName : 'Mesa'}
        </Button>
    )
}

export default TableButton