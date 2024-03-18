import { NotificationsIcon } from '@/components/common/IconsMaterial'
import { Logout } from '@mui/icons-material'
import { Badge,  ListItemIcon, Menu, MenuItem } from '@mui/material'
import { FC } from 'react'

interface MobileProps {
    mobileMoreAnchorEl: HTMLElement | null
    mobileMenuId: string
    isMobileMenuOpen: boolean
    handleMobileMenuClose: () => void;
    logout: () => void;
}
const MobileMenu: FC<MobileProps> = ({ 
    mobileMoreAnchorEl, 
    mobileMenuId, 
    isMobileMenuOpen,
    handleMobileMenuClose,
    logout
 }) => {
  return (
      <Menu
          anchorEl={mobileMoreAnchorEl}
          anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
          }}
          id={mobileMenuId}
          keepMounted
          transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
          }}
          open={isMobileMenuOpen}
          onClose={handleMobileMenuClose}
      >
          {/* <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem> */}
          <MenuItem>
              <ListItemIcon>
                  <Badge badgeContent={17} color="success">
                      <NotificationsIcon />
                  </Badge>
              </ListItemIcon>
              Notificación 
          </MenuItem>
          <MenuItem onClick={logout}>
              <ListItemIcon>
                  <Logout /> 
              </ListItemIcon>
              Cerrar sesión 
          </MenuItem>
      </Menu>
  )
}

export default MobileMenu