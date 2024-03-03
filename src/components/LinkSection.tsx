import PaletteIcon from "@mui/icons-material/Palette"
import ShareIcon from "@mui/icons-material/Share"
import { Grid, Icon, IconButton, Tooltip } from "@mui/material"
import React from "react"
import GitHubLogo from "react:~assets/github-logo.svg"

import "./LinkSection.css"

import { useState } from "react"

import _useConfig from "../hooks/useConfig"

export default function LinkSection({ useConfig = _useConfig }) {
    const { config } = useConfig()
    const [shareTooltipOpen, setShareTooltipOpen] = useState(false)
    const [shareResultTooltipOpen, setShareResultTooltipOpen] = useState(false)
    const [shareResultTooltipText, setShareResultTooltipText] = useState(chrome.i18n.getMessage('linkCopiedToClipboardSuccess'))
    const [storedTimeout, setStoredTimeout] = useState<any>()

    const shareTooltipTitle = chrome.i18n.getMessage('shareTooltipTitle')
    const githubTooltipTitle = chrome.i18n.getMessage('githubTooltipTitle')
    const creatorTooltipTitle = chrome.i18n.getMessage('creatorTooltipTitle')

    const shareTooltipOpened = () => {
        setShareTooltipOpen(true)
    }

    const shareTooltipClosed = () => {
        setShareTooltipOpen(false)
    }

    const copiedTooltipOpened = () => {
        setShareResultTooltipOpen(true)
    }

    const copiedTooltipClosed = () => {
        setShareResultTooltipOpen(false)
    }

    const openShareErrorDialog = () => {
        setShareResultTooltipText(chrome.i18n.getMessage('linkCopiedToClipboardError'))
        setShareTooltipOpen(false)
        setShareResultTooltipOpen(true)

        if (storedTimeout) {
            clearTimeout(storedTimeout)
        }
        const timeout = setTimeout(() => {
            setShareResultTooltipOpen(false)
        }, 1250)
        setStoredTimeout(timeout)
    }

    const copyToClipboard = async (text: string) => {

        try {
            await navigator.clipboard.writeText(text)
            setShareTooltipOpen(false)
            setShareResultTooltipOpen(true)

            if (storedTimeout) {
                clearTimeout(storedTimeout)
            }
            const timeout = setTimeout(() => {
                setShareResultTooltipOpen(false)
            }, 1250)
            setStoredTimeout(timeout)
        } catch (e) {
            openShareErrorDialog()
        }
    }

    const shareClicked = async (e: any) => {
        const data = {
            title: chrome.i18n.getMessage('sharePruneTitle'),
            text: chrome.i18n.getMessage('sharePruneText'),
            url: config.share?.url
        }

        console.debug('sharing data', data)

        try {
            if (navigator.canShare && navigator.canShare(data)) {
                await navigator.share(data)
            } else {
                await copyToClipboard(data.url)
            }
        } catch (e) {
            console.error('error sharing', e)

            if (e.toString().includes('canceled')) {
                console.debug('share canceled, attempting to copy to clipboard')
                await copyToClipboard(data.url)
            }
            else {
                openShareErrorDialog()
            }
        }
    }

    return (
        <Grid className="link-section">
            {process.env.PLASMO_BROWSER !== 'edge' &&
                <>
                    {!shareResultTooltipOpen && (
                        <Tooltip
                            open={shareTooltipOpen}
                            onOpen={shareTooltipOpened}
                            onClose={shareTooltipClosed}
                            title={shareTooltipTitle}>
                            <IconButton href="#share" onClick={shareClicked}>
                                <ShareIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {shareResultTooltipOpen && (
                        <Tooltip
                            open={shareResultTooltipOpen}
                            onOpen={copiedTooltipOpened}
                            onClose={copiedTooltipClosed}
                            title={shareResultTooltipText}>
                            <IconButton href="#share" onClick={shareClicked}>
                                <ShareIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </>}
            <Tooltip title={githubTooltipTitle}>
                <IconButton target="_blank" href="https://github.com/tbrockman/prune">
                    <Icon>
                        <GitHubLogo />
                    </Icon>
                </IconButton>
            </Tooltip>
            <Tooltip title={creatorTooltipTitle}>
                <IconButton target="_blank" href="https://theo.lol">
                    <PaletteIcon />
                </IconButton>
            </Tooltip>
        </Grid>
    )
}
