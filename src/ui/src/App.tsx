import React from 'react'
import MainForm from './pages/MainForm'
import './App.css'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import useConfig from './hooks/useConfig'

function App() {

  const theme = createTheme({
    palette: {
      primary: {
        main: '#03a9f4'
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'lowercase',
            color: '#fff'
          }
        }
      },
      MuiFormControlLabel: {
        styleOverrides: {
          root: {
            paddingRight: '0.5rem'
          }
        }
      }
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <div className='app'>
        <MainForm />
      </div>
    </ThemeProvider>
  );
}

export default App;
