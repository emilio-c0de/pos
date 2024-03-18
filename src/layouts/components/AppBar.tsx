import React, { FC } from 'react' 
import { Badge, Box, IconButton, Stack, Toolbar, Typography, styled } from '@mui/material'; 
import { MenuIcon, MoreIcon, NotificationsIcon } from '@/components/common/IconsMaterial.tsx';
import { AccountCircle } from '@mui/icons-material'; 
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
// import UserRoleInfo from './UserRoleInfo.tsx';

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const drawerWidth: number = 190;
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));


interface AppBarComponentProps {
    handleProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
    handleMobileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
    menuId: string
    mobileMenuId: string
    open: boolean
    toggleDrawer(): void
}

const AppBarComponent: FC<AppBarComponentProps> = (
    {
        handleProfileMenuOpen,
        handleMobileMenuOpen,
        menuId,
        mobileMenuId,
        open,
        toggleDrawer
    }
) => {
 
 

    return (
        <AppBar position="absolute" open={open}>
            <Toolbar sx={{
                pr: '24px', // keep right padding when drawer closed
            }} >
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleDrawer}
                    sx={{
                        marginRight: '36px',
                        ...(open && { display: 'none' }),
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography
                    component="h1"
                    variant="h6"
                    color="inherit"
                    noWrap
                    sx={{ flexGrow: 1 }}
                >
                    AcontPlus POS
                </Typography>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} />
                <Box
                    sx={{
                        flexGrow: 1,
                        display: { xs: 'block', sm: 'flex', md: 'flex' },
                        justifyContent: { xs: 'start', sm: 'start', md: 'end', lg: 'end', xl: 'end' },
                    }}
                >
                    <Stack    style={{ cursor: 'pointer' }}>
                        <Typography variant="caption">
                            Estab: 
                        </Typography> 
                        <Typography variant="caption">
                            <span>Usuario: </span>
                        </Typography>
                    </Stack>
                    {/* <UserRoleInfo
                        open={open}
                        id={id}
                        handleClose={handleClose}
                        anchorEl={anchorEl}
                    /> */}
                </Box>
                <Box sx={{ display: { xs: 'block', md: 'flex' } }}>
                    {/* <ModeToggleButton /> */}
                    {/* <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                            <Badge badgeContent={4} color="error">
                                <MailIcon />
                            </Badge>
                </IconButton>*/}
                    <IconButton sx={{ display: { xs: 'none', md: 'flex' } }}
                        size="large"
                        aria-label="show 17 new notifications"
                        color="inherit"
                    >
                        <Badge badgeContent={17} color="success">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <IconButton sx={{ display: { xs: 'none', md: 'flex' } }}
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                </Box>
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                        size="large"
                        aria-label="show more"
                        aria-controls={mobileMenuId}
                        aria-haspopup="true"
                        onClick={handleMobileMenuOpen}
                        color="inherit"
                    >
                        <MoreIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default AppBarComponent