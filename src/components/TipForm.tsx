import React, { type ChangeEvent, useState } from 'react';

import { LoadingButton } from '@mui/lab';
import {
	Button,
	FormGroup,
	InputAdornment,
	TextField,
	Tooltip,
} from '@mui/material';
import { FormOption } from './FormOption';
import './TipForm.css';
import _useTipClient from '../hooks/useTipClient';
import useConfig from '~hooks/useConfig';

export default function TipForm({ useTipClient = _useTipClient }) {
	const [tip, setTip] = useState(3);
	const [isTipping, setTipping] = useState(false);
	const tipClient = useTipClient();
	const tipButtonText = chrome.i18n.getMessage('tipButtonText');
	const tipButtonHint = chrome.i18n.getMessage('tipButtonHint');
	const reviewButtonText = chrome.i18n.getMessage('reviewButtonText');
	const reviewButtonHint = chrome.i18n.getMessage('reviewButtonHint');
	const { config } = useConfig();
	const reviewUrl = config.review.url;

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
		<FormOption style={{ marginLeft: '0px' }}>
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
							step: 'any',
						},
						startAdornment: <InputAdornment position="start">$</InputAdornment>,
					}}
				/>
				<Tooltip
					placement="top"
					arrow={true}
					enterDelay={1500}
					enterNextDelay={750}
					title={tipButtonHint}
				>
					<LoadingButton
						color="secondary"
						variant="contained"
						loading={isTipping}
						onClick={tipButtonClicked}
					>
						{tipButtonText}
					</LoadingButton>
				</Tooltip>
				<Tooltip
					placement="top"
					arrow={true}
					enterDelay={1500}
					enterNextDelay={750}
					title={reviewButtonHint}
				>
					<Button
						target="_blank"
						href={reviewUrl}
						style={{ marginLeft: '8px' }}
						variant="outlined"
						color="info"
					>
						{reviewButtonText}
					</Button>
				</Tooltip>
			</FormGroup>
		</FormOption>
	);
}
