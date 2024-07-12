// Dummy tab for previewing options page for screenshots in app store
// URL: chrome-extension://elomkolcdcolfdhcjcffgcmkejckhpem/tabs/store-preview.html
// TODO: automate screenshot of this during builds with browserless/chrome
import Popup from '../popup';
import Grid from '@mui/material/Grid';

import './store-preview.css'

export default function OptionStorePreview() {
	if (process.env.NODE_ENV === 'development') {
		return (
			// 1,280 x 800 or 640 x 400
			<Grid className='store-preview-container' container justifyContent={"center"} alignItems={"center"}>
				<Popup />
			</Grid>
		);
	}
	return <></>;
}
