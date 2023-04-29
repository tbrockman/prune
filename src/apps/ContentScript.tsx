import React, { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import createTheme from '../styles/theme';
import { useStore as _useStore } from '../hooks/useStore';
import { ContentScriptMain } from '~pages/ContentScriptMain';

function ContentScript({ useStore = _useStore }) {
	const init = useStore((state) => state.init);

	const theme = createTheme();

	useEffect(() => {
		init();
	}, [init]);

	return (
		<ThemeProvider theme={theme}>
			<div className="app">
				<ContentScriptMain/>
			</div>
		</ThemeProvider>
	);
}

export default ContentScript;
