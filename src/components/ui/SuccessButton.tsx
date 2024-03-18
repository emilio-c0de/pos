import styled from "@emotion/styled";
import { Button } from "@mui/material";

// Styled component for Bootstrap-like button with success color
export const SuccessButton = styled(Button)({
    backgroundColor: '#28a745',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#218838',
    },
});