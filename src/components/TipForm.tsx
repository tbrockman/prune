import React, { type ChangeEvent, useState } from 'react';

import { LoadingButton } from '@mui/lab';
import { FormGroup, FormLabel, InputAdornment, TextField } from '@mui/material';
import { FormOption } from './FormOption';
import './TipForm.css';
import _useTipClient from '../hooks/useTipClient';
import LabelWithHint from './LabelWithHint';

export default function TipForm({ useTipClient = _useTipClient }) {
	const [tip, setTip] = useState(3);
	const [isTipping, setTipping] = useState(false);
	const tipClient = useTipClient();
	const tipHint =
		'the developer will survive without it, but still appreciates your support';
	const tipLabel = 'support the developer:';

	const onTipChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTip(parseFloat(event.target.value));
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
		<FormOption style={{marginLeft: '0px'}}>
			<FormLabel>
				<LabelWithHint hint={tipHint} label={tipLabel} />
			</FormLabel>
			<FormGroup className="tip-form-group">
				<TextField
					margin="dense"
					hiddenLabel
					size="small"
					variant="filled"
					type="number"
					value={tip}
					onChange={onTipChange}
					color="secondary"
					InputProps={{
						className: 'tip-input',
						inputProps: {
							min: 1,
							max: 1000,
							step: 'any'
						},
						startAdornment: (
							<InputAdornment position="start">$</InputAdornment>
						),
					}}
				/>
				<LoadingButton
					color="secondary"
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
