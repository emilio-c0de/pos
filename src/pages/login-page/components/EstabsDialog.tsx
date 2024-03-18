

import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import { blue } from '@mui/material/colors';
import { TransitionProps } from '@mui/material/transitions';
import { ReactElement, Ref, forwardRef } from 'react';
import { Button, DialogActions, Slide, Typography } from '@mui/material'; 
import { UserRole } from '@/models/user.model';
import { hideLoader, showLoader } from '@/utils/loader'; 
import { Establecimiento } from '@/models/estab.model';
import { authService } from '@/services/auth.service';
import { ToastType, notify } from '@/utils/toastify/toastify.util';
import { isApiResponse } from '@/models/api-response';

interface EstabsDialogProps {
    open: boolean;
    userRoles: Array<UserRole>
    onClose(value: boolean): void;
    setDataLogin(userRole: UserRole):void
}

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        children: ReactElement<any, any>;
    },
    ref: Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const EstabsDialog = (props: EstabsDialogProps) => {
    const { onClose, open, userRoles, setDataLogin } = props; 
    const establecimientos: Array<Establecimiento> = userRoles.flatMap((userRole) => userRole.establecimientos)

    const handleClose = () => {
        onClose(false);
    };

    const handleListItemClick = (value: Establecimiento) => {
        const userData = userRoles.find((pp) => pp.companyId === value.idEntidad)
        onClose(false) 
        if (userData) {
            const dataEstab = establecimientos.find((estab: Establecimiento) => estab.codEstab === value.codEstab);
            if (dataEstab) {
                userData.bussinesName = dataEstab.nombreComercial;
            }
            showLoader();
            authService.createToken(userData)
                .then(response => {
                    if(isApiResponse(response)){
                        if (response.code === "0") {
                            notify({
                                type: ToastType.Warning,
                                content: response.message
                            }) 
                        }
                        if (response.code === "1") { 
                            const userRole: UserRole = JSON.parse(response.payload as string);  
                            userData.token = userRole.token;   
                            setDataLogin(userData) ;
                        }
                    }
                })
                .catch(error=>{
                    console.log(error)
                })
                .finally(() => hideLoader())
        }
    }

    const buttonSx = {
        bgcolor: "#212121",
        '&:hover': {
            bgcolor: "#424242",
        },
    };

    return (
        <Dialog open={open} TransitionComponent={Transition}>
            <DialogTitle>Establecimientos: </DialogTitle>
            <List>
                {establecimientos.map((estab, index) => (
                    <ListItem disableGutters key={index}>
                        <ListItemButton onClick={() => handleListItemClick(estab)}>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                    <PersonIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={estab.nombreComercial} secondary={
                                <>
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {estab.ruc}
                                    </Typography>
                                    {` — ${estab.entidad}`}
                                </>
                            } />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <DialogActions>
                <Button onClick={handleClose} size='large' sx={buttonSx} fullWidth variant='contained'>Cerrar</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EstabsDialog
