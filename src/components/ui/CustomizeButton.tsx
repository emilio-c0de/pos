
import styled from '@emotion/styled';
import Button from '@mui/material/Button'; 

// Styled component for Bootstrap-like button with danger color
const DangerButton = styled(Button)({
    backgroundColor: '#dc3545',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#c82333',
    },
});

// Styled component for Bootstrap-like button with error color
const ErrorButton = styled(Button)({
    backgroundColor: '#f8d7da',
    color: '#721c24',
    '&:hover': {
        backgroundColor: '#f5c6cb',
    },
});

// Styled component for Bootstrap-like button with success color
const SuccessButton = styled(Button)({
    backgroundColor: '#28a745',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#218838',
    },
});

// Styled component for Bootstrap-like button with info color
const InfoButton = styled(Button)({
    backgroundColor: '#17a2b8',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#138496',
    },
});

// Styled component for Bootstrap-like button with primary color
const PrimaryButton = styled(Button)({
    backgroundColor: '#007bff',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#0056b3',
    },
});

// Styled component for Bootstrap-like button with warning color
const WarningButton = styled(Button)({
    backgroundColor: '#ffc107',
    color: '#212529',
    '&:hover': {
        backgroundColor: '#ffca2b',
    },
});

export  {
    DangerButton,
    ErrorButton,
    SuccessButton,
    InfoButton,
    PrimaryButton,
    WarningButton, 
}

