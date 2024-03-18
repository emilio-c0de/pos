import styled from "@emotion/styled";
import { Button } from "@mui/material";

// Styled component for Bootstrap-like button with dark color
export const DarkButton = styled(Button)({
    backgroundColor: '#343a40',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#23272b',
    },
});