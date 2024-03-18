import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { pink } from "@mui/material/colors";

// Styled component for Bootstrap-like button with success color
export const PinkButton = styled(Button)({
    backgroundColor: pink[500],
    color: '#fff',
    '&:hover': {
        backgroundColor: pink[500],
    },
});