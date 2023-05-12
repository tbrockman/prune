import React, { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import createTheme from '../theme';
import { useStore as _useStore } from '../hooks/useStore';
import { LockedMain } from '~pages/LockedMain';

function Locked({ matchingFilters, useStore = _useStore }) {
	const init = useStore((state) => state.init);
	console.log('content script init');
	const theme = createTheme();

	useEffect(() => {
		init();
	}, [init]);

	return (
		<ThemeProvider theme={theme}>
			<div className="app">
				<LockedMain matchingFilters={matchingFilters} />
			</div>
		</ThemeProvider>
	);
}

export default Locked;
