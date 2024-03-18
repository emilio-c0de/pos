import {Grid, Paper, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";


const AuthLayout = () => {
    return (
        <Grid container component="main" sx={{ minHeight: '100vh', backgroundImage: "linear-gradient(315deg, #e69335 0%, #e7186e 74%)", }}>

            <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="center"
                item
                xs={false}
                sm={4}
                md={8}
            // sx={{
            //     backgroundImage: `url(https://media.geeksforgeeks.org/wp-content/uploads/20200326181026/wave3.png)`,
            //     backgroundRepeat: 'no-repeat',
            //     backgroundColor: (t) =>
            //         t.palette.mode === 'light' ? t.palette.grey[500] : t.palette.grey[900],
            //     backgroundSize: 'cover',
            //     backgroundPosition: 'center',

            // }}
            >
                <Typography variant="h2" className="animate-charcter">
                    AcontPlus POS
                </Typography>


            </Grid>
            <Grid item xs={12} sm={8} md={4} component={Paper} elevation={3} square>
                <Outlet />
            </Grid>
        </Grid>
    )
}

export default AuthLayout;