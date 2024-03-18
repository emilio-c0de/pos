import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import InputSearch from './InputSearch'

const ItemSectionHeader = () => {
  return (
      <Box component="section" marginBottom={1}>
          <Grid container spacing={1} alignItems="center">
              <Grid item xs={12} sm={6} md={6} lg={6} container justifyContent="flex-start">
                  <InputSearch />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={6} sx={{
                  display: { xs: 'none', sm: 'block', }, // Oculta en tamaños xs y sm
              }}>
              </Grid>
          </Grid>
      </Box>
  )
}

export default ItemSectionHeader