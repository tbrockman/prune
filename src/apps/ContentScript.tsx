import React, { useEffect } from 'react';
import './ContentScript.css';
import { ThemeProvider } from '@mui/material/styles';
import createTheme from '../styles/theme';
import { useStore as _useStore } from '../hooks/useStore';
import { Context } from '../types';
import Main from '../pages/Main';

function ContentScript({ useStore = _useStore }) {
	const init = useStore((state) => state.init);
	const theme = createTheme();

	useEffect(() => {
		init();
	}, [init]);

	return (
		<ThemeProvider theme={theme}>
			<div className="app">
				<Main context={Context.ContentScript} />
			</div>
		</ThemeProvider>
	);
}

export default ContentScript;
