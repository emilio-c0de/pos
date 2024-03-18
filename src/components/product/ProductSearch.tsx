
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useState } from 'react';
import { Avatar, Grid, Typography } from '@mui/material'; 
import { ProductSearchDto } from '@/models/external/product.model';
import { productSvc } from '@/services/external/product.service';
const brand_img = new URL('/images/product-default.png', import.meta.url).href

type ProductSearchProps = {
  onChange(id: number): void
}

const ProductSearch = ({ onChange }: ProductSearchProps) => {
  const [products, setProducts] = useState<Array<ProductSearchDto>>([])

  const search = async (value: string) => {
    try {
      if (value.length < 2) return

      // Intentamos realizar una búsqueda de productos utilizando un servicio llamado 'productService'
      // pasando la cadena de búsqueda 'value' como parámetro.
      productSvc.search({ textSearch: value }).then(mappedProducts => {
        setProducts(mappedProducts);
      })
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <Autocomplete
      id="productSearch"
      onInputChange={(_, value) => search(value)}
      options={products}
      selectOnFocus
      clearOnBlur
      freeSolo
      getOptionLabel={(option) => typeof option === 'string' ? option : option.descripcion}
      onChange={(_, value) => {
        if (!(typeof value === 'string')) {
          onChange(value?.idArticulo ?? 0)
        }
      }}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Grid container alignItems="center">
            <Grid item sx={{ display: 'flex', width: 44 }}>
              <Avatar
                alt="Product"
                src={brand_img}

              />
            </Grid>
            <Grid item>
              <Box component="span">
                <Typography variant="subtitle2" gutterBottom>
                  {option.descripcion}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {option.codigo} - {option.iva}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}
      size='small'
      renderInput={(params) => (
        <TextField 
          {...params}
          label="Buscar el Producto"
          inputProps={{
            ...params.inputProps
          }}
        />
      )}
    />
  );
}

export default ProductSearch;

