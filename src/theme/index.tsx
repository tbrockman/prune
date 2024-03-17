import { createTheme as muiCreateTheme } from '@mui/material/styles'

export default function createTheme() {
	return muiCreateTheme({
		palette: {
			primary: {
				main: '#51bc4e',
			},
			secondary: {
				main: '#472966',
			},
			info: {
				main: '#000',
			},
		},
		typography: {
			fontFamily: 'monospace',
			body1: {
				fontSize: '14px',
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
						'&:after': {
							borderColor: 'black'
						}
					},
					input: {
						paddingBottom: '8px',
						height: 'initial'
					}
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
						fontSize: '16px',
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
							fontSize: '24px',
						},
					},
				},
			},
			MuiList: {
				styleOverrides: {
					root: {
						paddingTop: '0',
						paddingBottom: '0',
					}
				}
			}
		},
	})
}
