// Dummy tab for previewing options page for screenshots in app store
// URL: chrome-extension://elomkolcdcolfdhcjcffgcmkejckhpem/tabs/store-preview.html
// TODO: automate screenshot of this during builds with browserless/chrome
import Popup from '~apps/Popup';
import Grid from '@mui/material/Grid';

export default function OptionStorePreview() {
	if (process.env.NODE_ENV === 'development') {
		return (
			// 1,280 x 800 or 640 x 400
			<Grid container width={'640px'} height={'400px'}>
				<Popup />
			</Grid>
		);
	}
	return <></>;
}
