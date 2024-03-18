import { OrderItem } from '@/models/order.model';
import { roundNumber } from '@/utils/round-number.util';
import { Grid, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { FC } from 'react';

import InputQuantity from './InputQuantity';

const buttonStyles: any = {
  fontSize: '20px',
  lineHeight: '30px',
  width: 25,
  minWidth: 30,
  border: 'none',
  margin: 0,
  textAlign: 'center', // Align text within the button
  padding: '0 15px',
  '&:hover': {
    cursor: 'pointer',
  },
};

const StyledButtonPlus = styled(Button)({
  ...buttonStyles,
  background: '#28a745',

  color: 'white',
  '&:hover': {
    background: '#218838',
  },
});

const StyledButtonMinus = styled(Button)({
  ...buttonStyles,
  background: '#dc3545',
  color: '#fff',
  '&:hover': {
    background: '#c82333',
  },
});

// const StyledButtonInfo = styled(Button)({
//   ...buttonStyles,
//   background: '#17a2b8',
//   color: '#fff',
//   '&:hover': {
//     background: '#17a2b8',
//   },
// });

type CartProps = {
  item: OrderItem
  // openCartDrawer(data: { isOpenCartDrawer: boolean, orderItem: OrderItem }): void
  deleteCartItem(): void
  decrementQuantity(): void
  incrementQuantity(): void
  changeInputQuantity(newQuantity: number): void
  onClickOpenDrawer():void
  // order: Order
}



const Cart: FC<CartProps> = ({
  item,
  deleteCartItem,
  incrementQuantity,
  decrementQuantity,
  changeInputQuantity,
  onClickOpenDrawer
}) => {


  return (
    <Card elevation={5} sx={{ display: 'flex' }}>
      <CardMedia onClick={onClickOpenDrawer}
        component="img"
        height="100"
        sx={{ width: 120, height: '10%', p: 0, objectFit: 'cover', alignSelf: 'center', cursor: "pointer" }}
        image={item.s3ObjectUrl}
        loading="lazy"
        alt="Img"
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto', p: '10px 10px 0px 10px' }}>
          <Typography component="div" variant="subtitle2" fontSize={11} fontWeight={700}>
            {item.descripcion}
          </Typography>
          {
            item.summary !== item.descripcion && (
              <Typography variant="subtitle2" color="text.secondary" component="div">
                {item.summary}
              </Typography>
            )
          }

          <Stack direction="row" gap={1} margin={0} padding={0}>
            <Typography variant="subtitle2" color="text.secondary" component="div">
              {item.quantity}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" component="div">
              x
            </Typography>
            <Typography variant="subtitle2" component="div" fontWeight={700}>
              ${roundNumber(item.precioConIVA)}
            </Typography>
            <Typography ml="auto" variant="subtitle2" component="div" fontWeight={700}>
              ${roundNumber(item.total)}
            </Typography>
          </Stack>
        </CardContent>
        <Grid container padding={1}>
          <Grid item xs={12} sm={6} md={12} lg={7} xl={7}>
            <Stack direction="row" >
              <StyledButtonMinus
                variant="contained"
                aria-label="Decrease Quantity"
                disabled={item.quantity === 1}
                onClick={decrementQuantity}
              >
                &minus;
              </StyledButtonMinus>
              <InputQuantity item={item} changeInputQuantity={changeInputQuantity}/>

              <StyledButtonPlus variant="contained" onClick={incrementQuantity}>&#43;</StyledButtonPlus>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={12} lg={5} xl={5}  >
            <Stack alignItems="center" direction="row" justifyContent="flex-end" alignContent="center" spacing={{ xs: 2, sm: 2, md: 1 }}>
              {/* <StyledButtonInfo color="secondary" variant="contained" aria-label="Mas datos">
                &hellip;
              </StyledButtonInfo> */}
              <StyledButtonMinus color="secondary" variant="contained" aria-label="Remove Quantity" onClick={deleteCartItem}>
                &times;
              </StyledButtonMinus>

            </Stack>
          </Grid>
        </Grid>
      </Box>

    </Card>
  );
}

export default Cart;