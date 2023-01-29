import { FormControlLabel } from '@mui/material';
import { FormOption } from './FormOption';
import LabelWithHint from './LabelWithHint';
import PersistedInput from './PersistedInput';

export default function ProductivityBlock() {
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
						hint={'text'}
						label={'turn on productivity mode 👨‍💻'}
						tooltipProps={{ placement: 'top' }}
					/>
				}
			/>
		</FormOption>
	);
}
