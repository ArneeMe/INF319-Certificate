'use client'
import { ThemeProvider } from '@mui/material/styles';
import {customTheme} from "@/app/style/customTheme";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider theme={customTheme}>
            {children}
        </ThemeProvider>
    );
};

export default RootLayout;