import { useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';

const ItemListSkeleton = () => {
  const theme = useTheme();
  // const isLg = useMediaQuery(theme.breakpoints.only('lg'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  let numCol = 4;
  if (isMd) numCol = 3;
  if (isSm) numCol = 3;
  if (isXs) numCol = 2;
  return (
    <Grid container wrap="nowrap">
      {Array.from(new Array(numCol)).map((_, index) => (
        <Box key={index} sx={{ width: "100%", marginRight: 0.5 }}>
          <Skeleton variant="rectangular" height={118} />
          <Box sx={{ pt: 0.5 }}>
            <Skeleton />
            <Skeleton width="60%" />
          </Box>
        </Box>
      ))}
    </Grid>
  );
}

export default ItemListSkeleton