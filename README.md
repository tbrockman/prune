# prune

A small [Plasmo](https://docs.plasmo.com/)-based brower extension to help you manage your garden of tabs.

## Features

- Prevents opening duplicate tabs, `prune` will focus the original for you if you already have it opened.
- Removes old tabs, `prune` can remove any tabs which haven't been looked at for more than `X` days.
- Groups stale tabs, `prune` will move aging tabs into a collapsed tab group named `🕒 old tabs` after `Y` days. -- credit to [@jlo](https://github.com/jeffreyolio) for the prompt to investigate using the tab groups API
- Limits number of visible tabs, `prune` can automatically group/remove least recently used tabs if you reach your pre-defined limit
- Bookmarks tabs before removing, `prune` can bookmark any tabs it would've closed, keeping them around a bit longer. -- suggested by [@valyagolev](https://github.com/valyagolev)
- Tips! Help support `prune`'s developer

As `prune` grows it might help you do _even_ more.

## Contributions

Check out the [code of conduct](CODE_OF_CONDUCT.md) and [contributing](CONTRIBUTING.md).

## Getting Started

First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

For creating the Safari XCode project, run:

```bash
cd build && xcrun safari-web-extension-converter safari-mv3-prod
```

## Submit to the webstores

Execute the `publish` workflow
