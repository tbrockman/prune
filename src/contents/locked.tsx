import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import { useStorage } from "@plasmohq/storage/hook"
import ContentScript from "~apps/ContentScript";
import cssText from "data-text:~/contents/Locked.css"

import type { PlasmoCSConfig } from "plasmo"
import useConfig from "~hooks/useConfig";

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

function matchDomain(domain, filters) {
  const some = filters.some((filter) => {
    const regex = new RegExp('^' + filter)
    return domain.match(regex)
  })
  return some
}

const Locked = () => {
  const { config } = useConfig()
  const [productivityModeEnabled] = useStorage('productivity-mode-enabled')
  const [suspendedDomains] = useStorage('productivity-suspend-domains', config.productivity?.domains)
  const match = matchDomain(window.location.host, suspendedDomains)

  if (match && productivityModeEnabled) {
    return (
      <CacheProvider value={styleCache}>
        <ContentScript/>
      </CacheProvider>
    )
  }
  else {
    return (<></>)
  }
}

export default Locked