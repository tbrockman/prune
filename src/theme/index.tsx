import { createTheme as muiCreateTheme, withTheme } from '@mui/material/styles'

import './index.css'

export default function createTheme() {
	return muiCreateTheme({
		palette: {
			primary: {
				main: '#00a152',
			},
			secondary: {
				main: '#330e62',
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
						boxShadow: 'none',
						'&:hover': {
							color: 'white',
							backgroundColor: '#6fbf73',
						},
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
			MuiMenu: {
				styleOverrides: {
					paper: {
						borderRadius: 0,
					},
				},
			},
			MuiPaper: {
				styleOverrides: {
					root: {
						borderRadius: 0,
					},
				}
			},
			MuiMenuItem: {
				styleOverrides: {
					root: {
						'&.Mui-selected': {
							backgroundColor: '#330e62',
							color: 'white',
						},
						'&.Mui-selected:hover': {
							backgroundColor: '#330e62',
						},
						'&:focus': {
							backgroundColor: '#6e43a3 !important',
							color: 'white',
						},
						'&:hover': {
							backgroundColor: '#6e43a3',
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
						'&:focus': {
							backgroundColor: 'unset',
						}
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
						fontSize: '1rem',
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
					inputRoot: {
						maxWidth: 'unset',
						padding: 0,
						marginLeft: '8px',
						paddingBottom: '4px',
						'& > .MuiAutocomplete-input.MuiFilledInput-input': {
							padding: '7px 4px',
						}
					},
					tag: {
						marginRight: '4px',
						marginBottom: '4px',
						marginLeft: '0',
						marginTop: '0',
						maxWidth: '30ch',
					},
					option: {
						'&[aria-selected="true"]': {
							backgroundColor: '#330e62 !important',
							color: 'white',
						},
						'&.Mui-focused': {
							backgroundColor: '#6e43a3',
							color: 'white',
						}
					},
					listbox: {
						paddingTop: 0,
						paddingBottom: 0,
						'& > .MuiAutocomplete-option.Mui-focused': {
							backgroundColor: '#6e43a3',
							color: 'white',
						}
					}
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
			MuiAccordion: {
				styleOverrides: {
					root: {
						'&::before': {
							display: 'none',
						},
					},
				}
			},
			MuiAccordionSummary: {
				styleOverrides: {
					root: {
						flexDirection: 'row-reverse',
						'& .MuiAccordionSummary-content': {
							marginLeft: '8px'
						}
					},
				}
			}
		},
	})
}
