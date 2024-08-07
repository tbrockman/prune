import React, { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import createTheme from '~theme';
import { useStore as _useStore } from '~hooks/useStore';
import { LockedMain } from '~pages/locked/LockedMain';

export default function LockedTab({ useStore = _useStore }) {
    const init = useStore((state) => state.init);
    const theme = createTheme();

    useEffect(() => {
        init();
    }, [init]);

    return (
        <ThemeProvider theme={theme}>
            <div className="app">
                <LockedMain />
            </div>
        </ThemeProvider>
    );
}
