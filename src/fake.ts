import AlarmHandler from "~src/handlers/alarm"
import TabCreatedHandler from "~src/handlers/tab-created"
import TabFocusedHandler from "~src/handlers/tab-focused"
import TabBookmarker from "~src/tab-utils/tab-bookmarker"
import TabDeduplicator from "~src/tab-utils/tab-deduplicator"
import TabGrouper from "~src/tab-utils/tab-grouper"
import TabPruner from "~src/tab-utils/tab-pruner"
import TabSuspender from "~src/tab-utils/tab-suspender"
import TabTracker from "~src/tab-utils/tab-tracker"

import { getOptionsAsync } from "./src/util"

const lock = new Set<number>()

chrome.runtime.onInstalled.addListener(async (details: any) => {
  if (details.reason == "update") {
    const version = chrome.runtime.getManifest().version
    let split = version.split(".")
    const major = parseInt(split[0])
    split = details.previousVersion.split(".")
    const prevMajor = parseInt(split[0])

    console.debug(
      "Updated from " + details.previousVersion + " to " + version + "!"
    )

    if (major >= 3 && major > prevMajor) {
      await chrome.storage.local.clear()
    }
  }
})
chrome.alarms.create({ periodInMinutes: 1 })

// Ran every minute
chrome.alarms.onAlarm.addListener(async (alarm) => {
  let bookmarker
  const options = await getOptionsAsync()
  const tracker = new TabTracker()
  const grouper = new TabGrouper()

  if (options["auto-prune-bookmark"]) {
    bookmarker = new TabBookmarker(options["auto-prune-bookmark-name"])
  }
  const pruner = new TabPruner(bookmarker)
  const handler = new AlarmHandler({ tracker, grouper, pruner, options })
  await handler.execute()
})

// When a new tab might be created
chrome.tabs.onUpdated.addListener(async (tabId, updatedInfo, tab) => {
  console.debug("tab updated", updatedInfo, tab)

  // TODO: handle when updatedInfo is tab being ungrouped
  if (updatedInfo.status != "loading") return

  let bookmarker
  const options = await getOptionsAsync()

  const tracker = new TabTracker()
  const grouper = new TabGrouper()

  if (options["auto-prune-bookmark"]) {
    bookmarker = new TabBookmarker(options["auto-prune-bookmark-name"])
  }
  const pruner = new TabPruner(bookmarker)
  const deduplicator = new TabDeduplicator(lock)
  const handler = new TabCreatedHandler({
    tracker,
    grouper,
    pruner,
    deduplicator,
    options
  })
  await handler.execute(tab)
})

// Whenever a tab comes into focus
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  let bookmarker

  const options = await getOptionsAsync()
  const tracker = new TabTracker()
  const grouper = new TabGrouper()
  const suspender = new TabSuspender()

  if (options["auto-prune-bookmark"]) {
    bookmarker = new TabBookmarker(options["auto-prune-bookmark-name"])
  }
  const pruner = new TabPruner(bookmarker)
  const handler = new TabFocusedHandler({
    tracker,
    grouper,
    pruner,
    options,
    suspender
  })
  await handler.execute(activeInfo)
})
