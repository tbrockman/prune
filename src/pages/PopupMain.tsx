import React from "react";
import { FormGroup, Grid, Typography } from "@mui/material";
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
  let pageComponent;

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
        options 🛠️
      </Typography>
      <FormGroup className="main-form-group options-form-group">
        {pageComponent}
      </FormGroup>

      <Typography component="h1" className="section-title">
        about 📝
      </Typography>
      <FormGroup className="main-form-group">
        <TipForm />
      </FormGroup>
    </Grid>
  );
}
