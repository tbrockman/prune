import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import { usePort } from '@plasmohq/messaging/hook'
import ContentScript from "~apps/ContentScript";
import cssText from "data-text:~/contents/locked.css"

import type { PlasmoCSConfig } from "plasmo"
 
const styleElement = document.createElement("style")
styleElement.textContent = cssText
console.log(cssText)
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

const Locked = () => {
    const port = usePort("lock-status")

    console.log('are we here at elast?')

    return (
        <CacheProvider value={styleCache}>
            <ContentScript/>
        </CacheProvider>
    )
}

export default Locked