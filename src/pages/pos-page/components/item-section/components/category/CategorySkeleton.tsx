import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton' 

const CategorySkeleton = () => {
  return (
      <Box component="section"
          sx={{
              display: "flex",
              flexGrow: 1,
              bgcolor: 'background.paper',
              borderRadius: 5,
              pr: 2,
              pl: 2,
              pt: 1,
              pb: 1,
              gap: 2
          }}
      >
          {
              new Array(3).fill(50).map((c, index) => (
                  <Skeleton variant="circular" key={index} width={c} height={c} />
              ))
          }
      </Box>
  )
}

export default CategorySkeleton