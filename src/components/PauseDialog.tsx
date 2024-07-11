import React, { useLayoutEffect, useRef } from 'react'
import type { SelectChangeEvent } from '@mui/material'
import { Button, Grid, MenuItem, Select, Typography } from '@mui/material'
import { useState } from 'react'
import { useStorage as _useStorage } from '@plasmohq/storage/hook'
import { usePort as _usePort } from '@plasmohq/messaging/hook'
import { Ports, SyncStorageKeys } from '~enums'
import { useSyncStorage } from '~hooks/useStorage'
import { setSyncStorage } from '~util/storage'
import parse from 'html-react-parser';

import './PauseDialog.css'
import { Tooltip } from 'node_modules/@mui/material/index'

export type PausedDialogProps = {
	matchingFilters: string[]
	url?: string
	useStorage?: typeof _useStorage
	usePort?: typeof _usePort
}

export default function PausedDialog({
	matchingFilters,
	url,
	usePort = _usePort,
}: PausedDialogProps) {
	const productivityPort = usePort(Ports.PRODUCTIVITY)
	const { [SyncStorageKeys.PRODUCTIVITY_SUSPEND_EXEMPTIONS]: exemptions } =
		useSyncStorage([SyncStorageKeys.PRODUCTIVITY_SUSPEND_EXEMPTIONS])
	const [unlockMinutes, setUnlockMinutes] = useState('15')
	const [current, setCurrent] = useState<HTMLElement>(null)
	const ref = useRef<HTMLElement>()
	const pageLockedDialog = chrome.i18n.getMessage('pageLockedDialog')
	const beProductiveButtonText = chrome.i18n.getMessage('beProductiveButtonText')
	const beProductiveButtonHint = chrome.i18n.getMessage('beProductiveButtonHint')
	const pageLockedOptionSeparatorText = chrome.i18n.getMessage('pageLockedOptionSeparatorText')
	const unlockButtonText = chrome.i18n.getMessage('unlockButtonText')
	const pageLockedTimeSelectorPrecursor = chrome.i18n.getMessage('pageLockedTimeSelectorPrecursor')
	const fifteenMinutesText = chrome.i18n.getMessage('fifteenMinutesText')
	const oneHourText = chrome.i18n.getMessage('oneHourText')
	const oneDayText = chrome.i18n.getMessage('oneDayText')

	const handleUnlockTimeChange = (event: SelectChangeEvent) => {
		setUnlockMinutes(event.target.value as string)
	}

	const unlockClicked = async () => {
		const end = new Date().getTime() + Number.parseInt(unlockMinutes) * 60 * 1000
		const newExemptions = {}
		matchingFilters.forEach((filter) => {
			newExemptions[filter] = end
		})
		const merged = { ...exemptions, ...newExemptions }
		await setSyncStorage({
			[SyncStorageKeys.PRODUCTIVITY_SUSPEND_EXEMPTIONS]: merged,
		})

		if (url) { window.location.href = url }
	}

	const beProductiveClicked = () => {
		productivityPort.send({})
	}

	useLayoutEffect(() => {
		setCurrent(ref.current)
	})

	return (
		<>
			<Typography gutterBottom padding={'16px 0'}>
				{parse(pageLockedDialog)}
			</Typography>
			<Grid container spacing={1} alignItems={'center'}>
				<Grid item>
					<Tooltip
						placement="top"
						arrow={true}
						enterDelay={1500}
						enterNextDelay={750}
						title={beProductiveButtonHint}
					>
						<Button
							color="secondary"
							variant="contained"
							endIcon={<>👨‍💻</>}
							onClick={beProductiveClicked}
						>
							{beProductiveButtonText}
						</Button>
					</Tooltip>
				</Grid>
				<Grid item>
					<Typography>{pageLockedOptionSeparatorText}</Typography>
				</Grid>
				<Grid item>
					<Button
						onClick={unlockClicked}
						color="info"
						variant="contained"
						endIcon={<>🔓</>}
					>
						{unlockButtonText}
					</Button>
				</Grid>
				<Grid item>
					<Typography>{pageLockedTimeSelectorPrecursor}</Typography>
				</Grid>
				<Grid item width={'87px'} height={'100%'}>
					<Select
						variant="filled"
						color="info"
						labelId="unlock-time-select-label"
						id="unlock-time-select"
						value={unlockMinutes}
						label="Time"
						autoWidth={false}
						onChange={handleUnlockTimeChange}
						className="unlock-container"
						ref={ref}
						MenuProps={{
							container: current,
						}}
					>
						<MenuItem value={15}>{fifteenMinutesText}</MenuItem>
						<MenuItem value={60}>{oneHourText}</MenuItem>
						<MenuItem value={1440}>{oneDayText}</MenuItem>
					</Select>
				</Grid>
			</Grid>
		</>
	)
}
