import { Chip } from '@mui/material' 

type PrimaryStatusTableProps = {
    status: boolean;
};

const PrimaryStatusTable: React.FC<PrimaryStatusTableProps> = ( {status}) => {
    return (
        <Chip label={status ? 'Activo' : 'Inactivo'} size='small' color={status ? 'success' : 'error'} />
    );
};


export default PrimaryStatusTable