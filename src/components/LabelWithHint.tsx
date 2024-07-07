import React from 'react';
import { Tooltip } from '@mui/material';
import { SyncStorageKeys } from '~enums';
import { useSyncStorage } from '~hooks/useStorage';


type LabelWithHintProps = {
	label: string | JSX.Element;
	hint: string;
	tooltipProps?: any
};

export default function LabelWithHint({
	label,
	hint,
	tooltipProps
}: LabelWithHintProps) {
	const { [SyncStorageKeys.SHOW_HINTS]: showHints } = useSyncStorage([SyncStorageKeys.SHOW_HINTS]);

	return (
		<Tooltip
			placement="top"
			arrow={true}
			enterDelay={1000}
			enterNextDelay={750}
			{...tooltipProps}
			title={showHints ? hint : ''}
		>
			<div>{label}</div>
		</Tooltip>
	);
}
