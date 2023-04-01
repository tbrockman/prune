import React, { useEffect } from 'react';
import Main from './pages/Main';
import './Options.css';
import { ThemeProvider } from '@mui/material/styles';
import createTheme from './styles/theme';
import { useStore as _useStore } from './hooks/useStore';

function Options({ useStore = _useStore }) {
	const init = useStore((state) => state.init);
	const theme = createTheme();

	useEffect(() => {
		init();
	}, [init]);

	return (
		<ThemeProvider theme={theme}>
			<div className="app">
				<Main />
			</div>
		</ThemeProvider>
	);
}

export default Options;
