'use client'; // Mark as Client Component due to ThemeProvider

import { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import theme from '../theme/theme';
import Footer from '../Component/Footer';

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                        <Box sx={{ flex: 1 }}>
                            {children}
                        </Box>
                        <Footer />
                    </Box>
                </ThemeProvider>
            </body>
        </html>
    );
}