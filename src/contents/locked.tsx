import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import { useStorage } from "@plasmohq/storage/hook"
import ContentScript from "~apps/ContentScript";
import cssText from "data-text:~/contents/Locked.css"

import type { PlasmoCSConfig } from "plasmo"
import useConfig from "~hooks/useConfig";
import { StorageKeys } from "~enums";

const styleElement = document.createElement("style")
styleElement.textContent = cssText
const styleCache = createCache({
  key: "plasmo-mui-cache",
  prepend: true,
  container: styleElement
})

export const getStyle = () => styleElement

export const config: PlasmoCSConfig = {
  matches: ["https://theo.lol/"],
  all_frames: true
}

function getMatchingFilters(domain, filters: string[]): string[] {
  return filters.filter((filter) => {
    const regex = new RegExp('^' + filter)
    return domain.match(regex)
  })
}

function allMatchingFiltersExempt(filters: string[], exemptions: { [key: string]: any }) {
  return !filters.some((filter) => { exemptions.hasOwnProperty(filter)})
}

const Locked = () => {
  const { config } = useConfig()
  const [productivityModeEnabled] = useStorage(StorageKeys.PRODUCTIVITY_MODE_ENABLED)
  const [domainFilters] = useStorage(StorageKeys.PRODUCTIVITY_SUSPEND_DOMAINS, config.productivity?.domains)
  const [exemptions] = useStorage<{ [key: string]: string }>(StorageKeys.PRODUCTIVITY_SUSPEND_EXEMPTIONS, {})
  // Get an array of matched filters, this is probably always length 1 but let's make
  // sure we're handling power users that use regexes properly
  const matchingFilters = getMatchingFilters(window.location.host, domainFilters)
  // In order to be exempt, we have to have created an exemption for all matching filters
  const isExempt = allMatchingFiltersExempt(matchingFilters, exemptions)

  if (productivityModeEnabled && matchingFilters.length > 0 && !isExempt) {
    return (
      <CacheProvider value={styleCache}>
        <ContentScript matchingFilters={matchingFilters}/>
      </CacheProvider>
    )
  }
  else {
    return (<></>)
  }
}

export default Locked