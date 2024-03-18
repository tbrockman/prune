import React, { type ChangeEvent, useState, useRef } from 'react';

import { LoadingButton } from '@mui/lab';
import {
	Button,
	ButtonGroup,
	FormControl,
	FormGroup,
	InputAdornment,
	InputBase,
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
		if (event.target.value === '') {
			return;
		}
		else {
			setTip(parseFloat(event.target.value));
		}
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
				<ButtonGroup
					component={'form'}
					variant="contained"
					className="tip-button-group"
					aria-label="Button group for selecting an amount to tip the developer, and then submitting the tip"
				>
					<InputBase
						color="warning"
						size='small'
						type="number"
						disabled={isTipping}
						className='tip-number-input'
						value={tip}
						onChange={onTipChange}
						placeholder='3'
						slotProps={{
							input: {
								min: 1,
								max: 1000,
								step: 'any',
								style: {
									padding: 0,
									width: (Math.max(tip.toString().length, 1) + 3) * 8 + 'px',
								}
							}
						}}
						startAdornment={<InputAdornment position="start">$</InputAdornment>}
					>
					</InputBase>
					<Tooltip
						placement="top"
						arrow={true}
						enterDelay={1500}
						enterNextDelay={750}
						title={tipButtonHint}
					>
						<LoadingButton
							type='submit'
							color="info"
							variant="contained"
							className='tip-button'
							loading={isTipping}
							onClick={tipButtonClicked}
						>
							{tipButtonText}
						</LoadingButton>
					</Tooltip>
				</ButtonGroup>
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
						rel="noopener"
						variant="contained"
						color="secondary"
					>
						{reviewButtonText}
					</Button>
				</Tooltip>
			</FormGroup>
		</FormOption >
	);
}
