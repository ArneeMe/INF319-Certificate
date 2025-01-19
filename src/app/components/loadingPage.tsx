import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const LoadingScreen: React.FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: 'background.default',
            }}
        >
            <CircularProgress />
        </Box>
    );
};

export default LoadingScreen;