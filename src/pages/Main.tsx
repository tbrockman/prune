import React from "react"

import Context from "~enums/context"

import { DeduplicateBlock } from "../components/DeduplicateBlock"
import { GroupTabsBlock } from "../components/GroupTabsBlock"
import { LRUBlock } from "../components/LRUBlock"
import ProductivityBlock from "../components/ProductivityBlock"
import { RemoveTabsBlock } from "../components/RemoveTabsBlock"
import { StorageBlock } from "../components/StorageBlock"
import { OptionsMain } from "./OptionsMain"

import "./Main.css"

import { ContentScriptMain } from "./ContentScriptMain"

export const OptionsHomePage = () => {
  return (
    <>
      <ProductivityBlock />
      <DeduplicateBlock />
      <GroupTabsBlock />
      <RemoveTabsBlock />
      <LRUBlock />
      <StorageBlock />
    </>
  )
}

type MainProps = {
  context: Context
}

export default function Main({ context }: MainProps) {
  switch (context) {
    case Context.Options:
      return <OptionsMain />
    case Context.ContentScript:
      return <ContentScriptMain />
  }
}
