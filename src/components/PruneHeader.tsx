import { Grid } from "@mui/material"
import React from "react"
import PruneLogo from "react:~assets/prune-banner.svg"

import LinkSection from "./LinkSection"

class PruneHeaderProps {
  showLinkSection?: Boolean
}

export function PruneHeader({ showLinkSection = true }: PruneHeaderProps) {
  return (
    <Grid
      container
      padding="2rem"
      paddingTop={"1rem"}
      paddingBottom={"1rem"}
      alignItems="center"
      justifyContent="space-between">
      <PruneLogo width="200px" />
      {showLinkSection && <LinkSection />}
    </Grid>
  )
}
