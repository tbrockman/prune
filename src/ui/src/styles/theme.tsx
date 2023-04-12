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
						// paddingRight: '0.5rem',
						margin: 0,
					},
				},
			},
			MuiCheckbox: {
				styleOverrides: {
					root: {
						marginLeft: '-2px',
						paddingLeft: 0,
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
						"&.Mui-selected, &:hover, &:visited": {
							backgroundColor: "#eeeeee",
						},
						"&:focus": {
							backgroundColor: "black !important",
							color: 'white'
						}
					}
				}
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
						fontSize: '1rem',
						padding: '0.5rem',
					},
				},
			},
			MuiChip: {
				styleOverrides: {
					root: {
						borderColor: 'black',
						margin: '4px',
						"&.Mui-focusVisible": {
							boxShadow: "-4px 4px black",
							top: "-4px",
							right: "-4px",
							backgroundColor: "white",
						}
					},
					deleteIcon: {
						color: '#dc2e2e',
						":hover": {
							color: "#581111"
						}
					}
				},
			},
			MuiAutocomplete: {
				styleOverrides: {
					tag: {
						margin: '4px',
					},
				},
			},
		},
	});
}
