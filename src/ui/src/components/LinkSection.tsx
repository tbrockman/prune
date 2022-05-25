import { Grid, Icon, IconButton, Tooltip } from '@mui/material';
import { ReactComponent as GitHubLogo } from '../assets/github-logo.svg';
import PaletteIcon from '@mui/icons-material/Palette';
import ShareIcon from '@mui/icons-material/Share';
// import ContentPasteIcon from '@mui/icons-material/ContentPaste';

import './LinkSection.css';

export default function LinkSection() {
	const test = (e: any) => {
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
		}
	};

	return (
		<Grid className="link-section">
			<Tooltip title="share">
				<IconButton href="#share" onClick={test}>
					<ShareIcon />
				</IconButton>
			</Tooltip>
			<Tooltip title="source code">
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
