import React, { useEffect } from 'react';
import MainForm from './pages/MainForm';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useStore } from './hooks/useStore';

function App() {
	const init = useStore((state) => state.init);
	const theme = createTheme({
		palette: {
			primary: {
				main: 'rgb(72, 185, 70)',
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
						maxWidth: '14ch',
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
