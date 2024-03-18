 
import { Item } from '@/models/item.model';
import { roundNumber } from '@/utils/round-number.util';
import { truncateText } from '@/utils/truncate-text.util'
import { Box, Card, CardActionArea, CardMedia, Chip, Divider, Stack, Typography } from '@mui/material'
const brand_img = new URL('/images/product-default.png', import.meta.url).href
type ItemCardProps = {
    item: Item 
    onClick: (e: React.MouseEvent) => void;
}


const ItemCard = ({ item, onClick }: ItemCardProps) => {
    return (
        <Card elevation={3} sx={{ maxWidth: 200,  maxHeight: 250, height: 200}}>
            <CardActionArea onClick={onClick}>
                <CardMedia
                    component="img"
                    height="120"
                    image={item.s3ObjectUrl ? item.s3ObjectUrl : brand_img}
                    alt="img"
                    loading="lazy"

                />
                <Box margin={2}>
                    <Typography variant="h5" sx={{
                        fontSize: '11px',
                        fontWeight: 2,
                    }}>
                        {truncateText(item.descripcion, 100)}

                    </Typography>
                    <Stack direction="row"
                        divider={<Divider orientation="vertical" flexItem />}
                        spacing={2} alignItems="center" justifyContent="space-between">

                        <Typography variant="subtitle2" gutterBottom fontWeight={700}> 
                            ${roundNumber(item.pvp.priceWithVat, 2)}
                        </Typography>
                        <Chip label={item.stock.toString()} color={item.stock > 0 ? 'success' : 'error'} size='small' />
                    </Stack>
                </Box> 
            </CardActionArea>
        </Card>
    )
}

export default ItemCard