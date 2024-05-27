import { createTheme as muiCreateTheme } from '@mui/material/styles'

import './index.css'

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
				main: '#fff',
			},
		},
		typography: {
			fontFamily: 'Emoji, Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif',
			button: {
				fontSize: '1rem',
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
					containedInfo: {
						color: '#000',
						border: '1px solid',
						borderColor: 'rgba(0, 0, 0, 0.5)',
						boxShadow: 'none'
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
			},
			MuiButtonGroup: {
				styleOverrides: {
					root: {
						boxShadow: 'none',
					},
				},
			},
		},
	})
}
