import React, { useEffect, useRef, useState } from "react";
import { FormGroup, Grid, Link, Typography } from "@mui/material";
import TipForm from "../components/TipForm";
import { Page, useStore } from "../hooks/useStore";
import ProductivitySettings from "../components/ProductivitySettings";
import { PruneHeader } from "../components/PruneHeader";
import ProductivityBlock from "~components/ProductivityBlock";
import { DeduplicateBlock } from "~components/DeduplicateBlock";
import { GroupTabsBlock } from "~components/GroupTabsBlock";
import { RemoveTabsBlock } from "~components/RemoveTabsBlock";
import { LRUBlock } from "~components/LRUBlock";
import { StorageBlock } from "~components/StorageBlock";


const OptionsHomePage = () => {
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

export function PopupMain() {
  const page = useStore((state) => state.page);
  const ref = useRef<HTMLFormElement>();
  const [minHeight, setMinHeight] = useState(0);

  let pageComponent;

  useEffect(() => {
    if (ref.current) {
      setMinHeight(Math.max(parseFloat(getComputedStyle(ref.current).getPropertyValue('height')), minHeight))
    }
  }, [page])

  switch (page) {
    case Page.Home:
      pageComponent = <OptionsHomePage />;
      break;
    case Page.ProductivitySettings:
      pageComponent = <ProductivitySettings />;
  }

  return (
    <Grid width="100%">
      <PruneHeader />
      <Typography className="section-title">
        options 🔧
      </Typography>
      <FormGroup ref={ref} style={{ minHeight }} className="main-form-group options-form-group">
        {pageComponent}
      </FormGroup>

      <Typography component="h1" className="section-title">
        about 📝
      </Typography>
      <FormGroup className="main-form-group">
        <Typography marginTop={'8px'} marginBottom={'16px'}>
          <b>prune</b> is a free, open-source extension made by <Link href='mailto:iam@theo.lol'>@tbrockman</Link> meant to help make your browsing less cluttered and more productive.
        </Typography>
        <TipForm />
      </FormGroup>
    </Grid>
  );
}
