import React from 'react';
import { Grid, Icon, IconButton, Tooltip } from '@mui/material';
import { ReactComponent as GitHubLogo } from '../assets/github-logo.svg';
import PaletteIcon from '@mui/icons-material/Palette';
import ShareIcon from '@mui/icons-material/Share';

import './LinkSection.css';
import { useState } from 'react';
import _useConfig from '../hooks/useConfig';

export default function LinkSection({ useConfig = _useConfig }) {
	const { config } = useConfig();
	const [shareTooltipOpen, setShareTooltipOpen] = useState(false);
	const [copiedTooltipOpen, setCopiedTooltipOpen] = useState(false);
	const [storedTimeout, setStoredTimeout] = useState<any>();

	const shareTooltipOpened = () => {
		setShareTooltipOpen(true);
	};

	const shareTooltipClosed = () => {
		setShareTooltipOpen(false);
	};

	const copiedTooltipOpened = () => {
		setCopiedTooltipOpen(true);
	};

	const copiedTooltipClosed = () => {
		setCopiedTooltipOpen(false);
	};

	const shareClicked = async (e: any) => {
		if (navigator.share) {
			navigator.share({
				title: 'Share',
				text: 'Help a friend prune their tabs',
				url: config.share?.url,
			});
		} else if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(config.share?.url ?? '');
			setShareTooltipOpen(false);
			setCopiedTooltipOpen(true);

			if (storedTimeout) {
				clearTimeout(storedTimeout);
			}
			const timeout = setTimeout(() => {
				setCopiedTooltipOpen(false);
			}, 1250);
			setStoredTimeout(timeout);
		}
	};

	return (
		<Grid className="link-section">
			{!copiedTooltipOpen && (
				<Tooltip
					open={shareTooltipOpen}
					onOpen={shareTooltipOpened}
					onClose={shareTooltipClosed}
					title="share"
				>
					<IconButton href="#share" onClick={shareClicked}>
						<ShareIcon />
					</IconButton>
				</Tooltip>
			)}
			{copiedTooltipOpen && (
				<Tooltip
					open={copiedTooltipOpen}
					onOpen={copiedTooltipOpened}
					onClose={copiedTooltipClosed}
					title="link copied to clipboard!"
				>
					<IconButton href="#share" onClick={shareClicked}>
						<ShareIcon />
					</IconButton>
				</Tooltip>
			)}
			<Tooltip title="github">
				<IconButton
					target="_blank"
					href="https://github.com/tbrockman/prune"
				>
					<Icon>
						<GitHubLogo />
					</Icon>
				</IconButton>
			</Tooltip>
			<Tooltip title="creator">
				<IconButton target="_blank" href="https://theo.lol">
					<PaletteIcon />
				</IconButton>
			</Tooltip>
		</Grid>
	);
}
