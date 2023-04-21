import React from "react";
import { Breadcrumbs, FormGroup, Grid, Link, Typography } from "@mui/material";
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

function buildBreadcrumbs(page: Page, setPage: (_: Page) => void) {
  // let stack: [Page, string][] = [];
  // let hierarchy = {
  // 	[Page.ProductivitySettings]: Page.Home,
  // 	[Page.Home]: null,
  // };
  let titles = {
    [Page.ProductivitySettings]: "options 🛠️",
    [Page.Home]: "options 🛠️",
  };
  // let node: Page | null = page;

  // while (node != null) {
  // 	stack.push([node, titles[node]]);
  // 	node = hierarchy[node];
  // }

  // return stack.reverse().map(([page, title]) => (
  // 	<Link
  // 		key={title}
  // 		underline="none"
  // 		color="black"
  // 		href={'#' + title}
  // 		onClick={() => setPage(page)}
  // 	>
  // 		{title}
  // 	</Link>
  // ));
  const title = titles[page];
  return (
    <Link
      key={title}
      underline="none"
      color="black"
      href={"#" + title}
      onClick={() => setPage(page)}
    >
      {title}
    </Link>
  );
}

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
  const setPage = useStore((state) => state.setPage);
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
      <Breadcrumbs className="section-title">
        {buildBreadcrumbs(page, setPage)}
      </Breadcrumbs>
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
