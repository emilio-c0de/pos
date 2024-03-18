import { Link, Typography } from "@mui/material";

function Copyright<T>(props: T) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link target="_blank" color="inherit" href="https://acontplus.com.ec/" rel="noreferrer">
                AcontPlus
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default Copyright;