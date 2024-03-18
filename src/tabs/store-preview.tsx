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
				<div>
					<svg width="100%" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">

						<path fill="none" stroke="green" stroke-width="2" d="M0,50
          C30,30 70,70 100,50
          S150,30 200,50
          S250,70 300,50
          S350,30 400,50
          S450,70 500,50
          S550,30 600,50" />

						<circle cx="15" cy="30" r="5" fill="green" />
						<circle cx="60" cy="25" r="5" fill="green" />
						<circle cx="110" cy="35" r="5" fill="green" />
						<circle cx="160" cy="45" r="5" fill="green" />
						<circle cx="210" cy="55" r="5" fill="green" />
						<circle cx="260" cy="45" r="5" fill="green" />
						<circle cx="310" cy="35" r="5" fill="green" />
						<circle cx="360" cy="25" r="5" fill="green" />
						<circle cx="405" cy="30" r="5" fill="green" />
					</svg>

				</div>
				<Popup />
			</Grid>
		);
	}
	return <></>;
}
