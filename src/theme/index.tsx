import { createTheme as muiCreateTheme } from '@mui/material/styles';

export default function createTheme() {
	return muiCreateTheme({
		palette: {
			primary: {
				main: '#48b946',
			},
			secondary: {
				main: '#673b97',
			},
			info: {
				main: '#000',
			},
		},
		typography: {
			fontFamily: 'Times New Roman, serif',
			body1: {
				fontSize: '16px',
			},
			button: {
				fontSize: '14px',
			},
		},
		components: {
			MuiButton: {
				styleOverrides: {
					root: {
						textTransform: 'lowercase',
						color: '#fff',
						borderRadius: 0,
					},
					outlinedInfo: {
						color: '#000',
					},
				},
			},
			MuiFormControlLabel: {
				styleOverrides: {
					root: {
						margin: 0,
					},
				},
			},
			MuiCheckbox: {
				styleOverrides: {
					root: {
						marginLeft: '-2px',
						paddingLeft: 0,
						color: 'black',
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
						maxWidth: '16ch',
					},
				},
			},
			MuiMenuItem: {
				styleOverrides: {
					root: {
						'&.Mui-selected, &:hover, &:visited': {
							backgroundColor: '#eeeeee',
						},
						'&:focus': {
							backgroundColor: 'black !important',
							color: 'white',
						},
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
					root: {},
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
						fontSize: '16px',
						padding: '8px',
					},
				},
			},
			MuiChip: {
				styleOverrides: {
					root: {
						borderColor: 'black',
						borderWidth: '2px',
						margin: '4px',
						'&.Mui-focusVisible': {
							boxShadow: '-4px 4px black',
							top: '-4px',
							right: '-4px',
							backgroundColor: 'white',
						},
					},
					deleteIcon: {
						color: '#dc2e2e',
						':hover': {
							color: '#581111',
						},
					},
				},
			},
			MuiAutocomplete: {
				styleOverrides: {
					tag: {
						marginRight: '4px',
						marginBottom: '4px',
						marginLeft: '0',
						marginTop: '0',
					},
				},
			},
			MuiSvgIcon: {
				styleOverrides: {
					root: {
						'&.MuiSvgIcon-fontSizeMedium': {
							fontSize: '24px',
						},
					},
				},
			},
			MuiIcon: {
				styleOverrides: {
					root: {
						'&.MuiIcon-fontSizeMedium': {
							fontSize: '24px'
						}
					}
				}
			}
		},
	});
}
