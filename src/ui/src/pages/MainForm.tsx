import React from 'react';
import {
	FormControl,
	FormControlLabel,
	FormGroup,
	MenuItem,
} from '@mui/material';
import './MainForm.css';
import TipForm from '../components/TipForm';
import { FormOption } from '../components/FormOption';
import _useOptions from '../hooks/useOptions';
import OptionsPersistedInput from '../components/PersistedInput';

function DeduplicateBlock({ useOptions = _useOptions }) {
	return (
		<FormOption>
			<FormControlLabel
				control={
					<OptionsPersistedInput
						component="checkbox"
						storageKey="auto-deduplicate"
					/>
				}
				label="focus existing tabs instead of opening duplicates"
			/>
		</FormOption>
	);
}

function GroupTabsBlock({ useOptions = _useOptions }) {
	const { options } = useOptions();

	return (
		<FormOption>
			<FormControlLabel
				control={
					<OptionsPersistedInput
						component="checkbox"
						storageKey="auto-group"
					/>
				}
				label="hide tabs after"
			/>
			<FormControlLabel
				control={
					<OptionsPersistedInput
						component="textfield"
						storageKey="auto-group-threshold"
						hiddenLabel
						size="small"
						variant="filled"
						type="number"
						InputProps={{
							inputProps: {
								max: 100,
								min: 0,
							},
						}}
						disabled={!options['auto-group']}
						value={options['auto-group-threshold']}
					/>
				}
				label="days in a group named"
			/>
			<FormControlLabel
				control={
					<OptionsPersistedInput
						component="textfield"
						storageKey="auto-group-name"
						hiddenLabel
						size="small"
						variant="filled"
						disabled={!options['auto-group']}
						value={options['auto-group-name']}
					/>
				}
				label=""
			/>
		</FormOption>
	);
}

function RemoveTabsBlock({ useOptions = _useOptions }) {
	const { options } = useOptions();

	return (
		<FormOption>
			<FormControlLabel
				control={
					<OptionsPersistedInput
						component="checkbox"
						storageKey="auto-prune"
					/>
				}
				label="close old tabs after"
			/>
			<FormControlLabel
				control={
					<OptionsPersistedInput
						component="textfield"
						hiddenLabel
						size="small"
						variant="filled"
						type="number"
						InputProps={{
							inputProps: {
								max: 1024,
								min: 0,
							},
						}}
						storageKey="prune-threshold"
						disabled={!options['auto-prune']}
					/>
				}
				label="days"
			/>
		</FormOption>
	);
}

function LRUBlock({ useOptions = _useOptions }) {
	const { options } = useOptions();

	return (
		<FormOption className="lru-options">
			<FormControl className="lru-options-control">
				<FormControlLabel
					control={
						<>
							<OptionsPersistedInput
								component="checkbox"
								storageKey="tab-lru-enabled"
							/>
							<OptionsPersistedInput
								component="select"
								storageKey="tab-lru-destination"
								disabled={!options['tab-lru-enabled']}
							>
								<MenuItem value={'group'}>group</MenuItem>
								<MenuItem value={'close'}>close</MenuItem>
							</OptionsPersistedInput>
						</>
					}
					label="least recently used tabs after"
					disabled={!options['tab-lru-enabled']}
				/>
				<FormControlLabel
					control={
						<OptionsPersistedInput
							component="textfield"
							hiddenLabel
							size="small"
							variant="filled"
							type="number"
							storageKey="tab-lru-size"
							disabled={!options['tab-lru-enabled']}
							InputProps={{
								inputProps: {
									max: 255,
									min: 0,
								},
							}}
						/>
					}
					label=""
				/>
			</FormControl>
		</FormOption>
	);
}

function StorageBlock({ useOptions = _useOptions }) {
	const { options } = useOptions();
	const tabStorageEnabled =
		options['auto-prune'] || options['tab-lru-destination'] === 'close';

	return (
		<FormOption>
			<FormControlLabel
				control={
					<OptionsPersistedInput
						component="checkbox"
						storageKey="auto-prune-bookmark"
						disabled={!tabStorageEnabled}
					/>
				}
				label="bookmark closed tabs under"
				disabled={!tabStorageEnabled}
			/>
			<FormControlLabel
				control={
					<OptionsPersistedInput
						component="textfield"
						hiddenLabel
						size="small"
						placeholder="pruned"
						variant="filled"
						fullWidth={false}
						storageKey="auto-prune-bookmark-name"
						disabled={
							!options['auto-prune-bookmark'] ||
							!tabStorageEnabled
						}
					/>
				}
				label=""
			/>
		</FormOption>
	);
}

export default function MainForm() {
	return (
		<FormGroup className="main-form-group">
			<DeduplicateBlock />
			<GroupTabsBlock />
			<RemoveTabsBlock />
			<LRUBlock />
			<StorageBlock />
			<TipForm />
		</FormGroup>
	);
}
