
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText'; 
import { useNavigate } from 'react-router-dom';
import { PrivateRoutes } from '@/routes';
import styled from '@mui/system/styled';
import { BarChartIcon, HomeIcon, PeopleIcon, PointOfSaleIcon, ShoppingCartIcon } from '@/components/common/IconsMaterial';
import { useState } from 'react';
import { ListItemButton } from '@mui/material';
import { themePalette } from '@/config/theme.config';

// Definir el estilo común
const commonIconStyle = { color: themePalette.PINK };

// Crear un componente styled para los íconos
const StyledIcon = styled(ListItemIcon)(commonIconStyle);


// Definir los íconos
const icons = {
    Home: <HomeIcon />,
    PointOfSale: <PointOfSaleIcon />,
    ShoppingCart: <ShoppingCartIcon />,
    People: <PeopleIcon />,
    BarChart: <BarChartIcon />,
};

type MenuItem = {
    label: string;
    route?: string;
    icon: React.ReactNode; // O el tipo adecuado para tus iconos
};

// Definir los elementos del menú
const menuItems: Array<MenuItem> = [
    { label: 'Dashboard', route: PrivateRoutes.DASHBOARD, icon: icons.Home },
    { label: 'POS', route: PrivateRoutes.POS, icon: icons.PointOfSale },
    { label: 'Pedidos', route: PrivateRoutes.ORDER, icon: icons.ShoppingCart },
    { label: 'Clientes', route: PrivateRoutes.CUSTOMER_COMPANY, icon: icons.People },
    { label: 'Reports', icon: icons.BarChart },
];

export const MenuRoutes = () => {
    const navigate = useNavigate();
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleListItemClick = (menuItem: MenuItem, index: number) => {
        navigate(`/${menuItem.route}`, { replace: true });
        setSelectedIndex(index);
    };

    return (
        <>
            {menuItems.map((menuItem, index) => (
                <ListItemButton
                    key={index}
                    selected={selectedIndex === index}
                    onClick={() => handleListItemClick(menuItem, index)}
                >
                    <StyledIcon>{menuItem.icon}</StyledIcon>
                    <ListItemText primary={menuItem.label} />
                </ListItemButton>
            ))}
        </>
    )

}
