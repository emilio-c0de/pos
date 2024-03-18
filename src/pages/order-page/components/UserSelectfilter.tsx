import { UserSelectHtmlOnly } from '@/models/user.model'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { ChangeEvent } from 'react'

type UserSelectfilterProps = {
    users: Array<UserSelectHtmlOnly>
    onChange(data: ChangeEvent<HTMLInputElement>): void
    value: string
}
const UserSelectfilter = ({ users, ...ops }: UserSelectfilterProps) => {
    return (
        <>
            {users.length > 0 && <TextField fullWidth
                id="users"
                name="users"
                label="Usuario"
                size='small'
                select
                {...ops}
            >
                <MenuItem value="0">
                    {"Todos"}
                </MenuItem>
                {
                    users.map((item, index) => (
                        <MenuItem value={item.idUsuario} key={index}>
                            {item.nombreUsuario}
                        </MenuItem>
                    ))
                }
            </TextField>
            }
        </>
    )
}

export default UserSelectfilter