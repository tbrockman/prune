import React, { ChangeEvent, useState } from 'react';

import { LoadingButton } from '@mui/lab';
import { FormGroup, FormLabel, InputAdornment, TextField } from '@mui/material';
import { FormOption } from './FormOption';
import './TipForm.css';
import _useTipClient from '../hooks/useTipClient';

export default function TipForm({ useTipClient = _useTipClient }) {
	const [tip, setTip] = useState(2);
	const [isTipping, setTipping] = useState(false);
	const tipClient = useTipClient();

	const onTipChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTip(parseInt(event.target.value));
	};

	const tipButtonClicked = async () => {
		const tipInCents = tip * 100;
		setTipping(true);
		const session = await tipClient.createSession(tipInCents);
		chrome.tabs.update({
			url: session.url,
		});
		setTipping(false);
	};

	return (
		<FormOption>
			<FormGroup className="tip-form-group">
				<FormLabel>support the developer: </FormLabel>
				<TextField
					margin="dense"
					hiddenLabel
					size="small"
					variant="filled"
					type="number"
					value={tip}
					onChange={onTipChange}
					InputProps={{
						inputProps: {
							min: 1,
							max: 1000,
						},
						startAdornment: (
							<InputAdornment position="start">$</InputAdornment>
						),
					}}
				/>
				<LoadingButton
					color="primary"
					variant="contained"
					loading={isTipping}
					onClick={tipButtonClicked}
				>
					💰 tip
				</LoadingButton>
			</FormGroup>
		</FormOption>
	);
}
