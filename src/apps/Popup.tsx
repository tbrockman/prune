import React, { useEffect } from "react"

import "./Popup.css"

import { ThemeProvider } from "@mui/material/styles"

import { useStore as _useStore } from "../hooks/useStore"
import createTheme from "../styles/theme"
import { PopupMain } from "~pages/PopupMain"

function Popup({ useStore = _useStore }) {
  const init = useStore((state) => state.init)
  const theme = createTheme()

  useEffect(() => {
    init()
  }, [init])

  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <PopupMain/>
      </div>
    </ThemeProvider>
  )
}

export default Popup
