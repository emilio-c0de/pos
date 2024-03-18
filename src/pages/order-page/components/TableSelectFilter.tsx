import { TableOrderFilter } from '@/models/table.model';
import { darken, lighten, styled } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const GroupHeader = styled('div')(({ theme }) => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: theme.palette.primary.main,
    backgroundColor:
        theme.palette.mode === 'light'
            ? lighten(theme.palette.primary.main, 0.85)
            : darken(theme.palette.primary.main, 0.8),
}));

const GroupItems = styled('ul')({
    padding: 0,
});

type TableSelectFilterProps = {
    tables: Array<TableOrderFilter>
    onChange(value: number):void
    value: string
}

export default function TableSelectFilter({ tables, onChange}: TableSelectFilterProps) {
    const sortedCities = [...tables].sort((a, b) => a.roomDescription.localeCompare(b.roomDescription));
    return (
        <>
            {
                tables.length > 0 && (
                    <Autocomplete
                        fullWidth
                        id="grouped-tables"
                        size='small'
                        options={sortedCities} 
                        groupBy={(option) => option.roomDescription}
                        getOptionLabel={(option) => option.description}
                        onChange={(_, newValue) => {
                            const id = newValue ? newValue.id : 0
                            onChange(id)
                        }}
                        renderInput={(params) => <TextField {...params} label="Mesa" />}
                        renderGroup={(params) => (
                            <li key={params.key}>
                                <GroupHeader>{params.group}</GroupHeader>
                                <GroupItems>{params.children}</GroupItems>
                            </li>
                        )}
                    />
                )
            }
        </>
    );
}
