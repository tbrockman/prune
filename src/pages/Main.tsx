import React from "react"

import { Context } from "~enums"

import { DeduplicateBlock } from "../components/DeduplicateBlock"
import { GroupTabsBlock } from "../components/GroupTabsBlock"
import { LRUBlock } from "../components/LRUBlock"
import ProductivityBlock from "../components/ProductivityBlock"
import { RemoveTabsBlock } from "../components/RemoveTabsBlock"
import { StorageBlock } from "../components/StorageBlock"
import { PopupMain } from "./PopupMain"

import "./Main.css"

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
