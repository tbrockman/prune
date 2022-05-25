import React, { useEffect } from 'react';
import MainForm from './pages/MainForm';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useStore as _useStore } from './hooks/useStore';

function App({ useStore = _useStore }) {
	const init = useStore((state) => state.init);
	const theme = createTheme({
		palette: {
			primary: {
				main: '#48b946',
			},
			secondary: {
				main: '#673b97',
			},
		},
		typography: {
			fontFamily: 'Times New Roman, serif',
		},
		components: {
			MuiButton: {
				styleOverrides: {
					root: {
						textTransform: 'lowercase',
						color: '#fff',
					},
				},
			},
			MuiFormControlLabel: {
				styleOverrides: {
					root: {
						paddingRight: '0.5rem',
					},
				},
			},
			MuiOutlinedInput: {
				styleOverrides: {
					notchedOutline: {
						border: 'none',
					},
				},
			},
			MuiFilledInput: {
				styleOverrides: {
					root: {
						backgroundColor: 'transparent !important',
					},
				},
			},
			MuiSelect: {
				styleOverrides: {
					select: {
						paddingLeft: '0',
						paddingBottom: '0',
						paddingTop: '0',
					},
				},
			},
			MuiInputBase: {
				styleOverrides: {
					root: {
						maxWidth: '12ch',
					},
				},
			},
			MuiFormLabel: {
				styleOverrides: {
					root: {
						color: '#000',
					},
				},
			},
			MuiTooltip: {
				styleOverrides: {
					tooltip: {
						fontSize: '1rem',
						padding: '0.5rem',
					},
				},
			},
		},
	});

	useEffect(() => {
		init();
	}, [init]);

	return (
		<ThemeProvider theme={theme}>
			<div className="app">
				<MainForm />
			</div>
		</ThemeProvider>
	);
}

export default App;
