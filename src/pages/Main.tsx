import React from "react"

import { Context } from "~enums"
import { PopupMain } from "./PopupMain"
import type { PlasmoGetStyle } from "plasmo"
import cssText from "data-text:~/pages/Main.css"

import { ContentScriptMain } from "./ContentScriptMain"

type MainProps = {
  context: Context
}

export default function Main({ context }: MainProps) {
  switch (context) {
    case Context.Options:
      return <PopupMain />
    case Context.ContentScript:
      return <ContentScriptMain />
  }
}
