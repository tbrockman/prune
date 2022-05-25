import { Tooltip } from '@mui/material';
import _useOptions from '../hooks/useOptions';
import { Options } from '../util';

type useOptionsReturn = {
	options: Options;
	setOptionAsync: Function;
};

type LabelWithHintProps = {
	label: string;
	hint: string;
	tooltipProps?: any;
	useOptions?: () => useOptionsReturn;
};

export default function LabelWithHint({
	label,
	hint,
	tooltipProps,
	useOptions = _useOptions,
}: LabelWithHintProps) {
	const { options } = useOptions();

	return (
		<Tooltip
			placement="top"
			arrow="true"
			enterDelay={1500}
			enterNextDelay={750}
			{...tooltipProps}
			title={options['show-hints'] ? hint : ''}
		>
			<div>{label}</div>
		</Tooltip>
	);
}
