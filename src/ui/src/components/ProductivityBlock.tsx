import { FormControlLabel, IconButton, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { FormOption } from './FormOption';
import LabelWithHint from './LabelWithHint';
import PersistedInput from './PersistedInput';
import { useStore, Page } from '../hooks/useStore';

export default function ProductivityBlock() {
	const { setPage } = useStore();

	const hint =
		'helps keep your browsing productive by pausing use of typical time wasting websites. turn it on manually or declare a schedule.';
	const label = 'turn on productivity mode 👨‍💻';

	const settingsIconClicked = () => {
		setPage(Page.ProductivitySettings);
	};

	return (
		<FormOption>
			<FormControlLabel
				control={
					<PersistedInput
						component="checkbox"
						storageKey="productivity-mode-enabled"
					/>
				}
				label={
					<LabelWithHint
						hint={hint}
						label={label}
						tooltipProps={{ placement: 'top' }}
					/>
				}
			/>
			<Tooltip
				placement="top"
				arrow={true}
				title="update productivity mode settings"
			>
				<IconButton aria-label="settings" onClick={settingsIconClicked}>
					<SettingsIcon />
				</IconButton>
			</Tooltip>
		</FormOption>
	);
}
