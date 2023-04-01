import React, { useEffect } from 'react';
import './ContentScript.css';
import { ThemeProvider } from '@mui/material/styles';
import createTheme from './styles/theme';
import { useStore as _useStore } from './hooks/useStore';
import PausedDialog from './pages/PausedDialog';
import { PruneHeader } from './components/PruneHeader';

function ContentScript({ useStore = _useStore }) {
	const init = useStore((state) => state.init);
	const theme = createTheme();

	useEffect(() => {
		init();
	}, [init]);

	return (
		<ThemeProvider theme={theme}>
			<div className="app">
				<PruneHeader></PruneHeader>
				<PausedDialog></PausedDialog>
			</div>
		</ThemeProvider>
	);
}

export default ContentScript;
