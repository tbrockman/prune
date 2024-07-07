import React, { useEffect } from "react"

import "./popup.css"

import { ThemeProvider } from "@mui/material/styles"
import { useStore as _useStore } from "~hooks/useStore"
import createTheme from "~theme"
import { PopupMain } from "~pages/popup/PopupMain"
import { initLogging } from "~util"

initLogging()

function Popup({ useStore = _useStore }) {
  const init = useStore((state) => state.init)
  const theme = createTheme()

  useEffect(() => {
    init()
  }, [init])

  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <PopupMain />
      </div>
    </ThemeProvider>
  )
}

export default Popup
