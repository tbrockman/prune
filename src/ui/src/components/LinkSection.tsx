import { Grid, Icon, IconButton, Snackbar, Tooltip } from '@mui/material';
import { ReactComponent as GitHubLogo } from '../assets/github-logo.svg';
import PaletteIcon from '@mui/icons-material/Palette';
import ShareIcon from '@mui/icons-material/Share';
// import ContentPasteIcon from '@mui/icons-material/ContentPaste';

import './LinkSection.css';
import { useState } from 'react';

export default function LinkSection() {
	const [snackOpen, setSnackOpen] = useState(false);

	const handleSnackClose = () => {
		setSnackOpen(false);
	};

	const shareClicked = async (e: any) => {
		console.log(navigator, window.navigator, navigator.share);

		// TODO: extract to config
		const chromeShopUrl =
			'https://chrome.google.com/webstore/detail/prune/gblddboefgbljpngfhgekbpoigikbenh?hl=en';

		if (navigator.share) {
			navigator.share({
				title: 'Share',
				text: 'Help a friend prune their tabs',
				url: chromeShopUrl,
			});
		} else if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(chromeShopUrl);
			setSnackOpen(true);
		}
	};

	return (
		<Grid className="link-section">
			<Snackbar
				open={snackOpen}
				autoHideDuration={1000}
				onClose={handleSnackClose}
				message="Link copied to clipboard!"
			/>
			<Tooltip title="share">
				<IconButton href="#share" onClick={shareClicked}>
					<ShareIcon />
				</IconButton>
			</Tooltip>
			<Tooltip title="github">
				<IconButton
					target="_blank"
					href="https://github.com/tbrockman/prune"
				>
					<Icon classes={{ root: '' }}>
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
