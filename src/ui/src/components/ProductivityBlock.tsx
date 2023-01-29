import { FormControlLabel } from '@mui/material';
import { FormOption } from './FormOption';
import LabelWithHint from './LabelWithHint';
import PersistedInput from './PersistedInput';

export default function ProductivityBlock() {

	const hint = 'helps keep your browsing productive by pausing use of typical time wasting websites. turn it on manually or declare a schedule.'
	const label = 'turn on productivity mode 👨‍💻'

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
		</FormOption>
	);
}
