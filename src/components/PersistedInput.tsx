import React from 'react';
import {
	Checkbox,
	type CheckboxProps,
	Select,
	type SelectProps,
	Switch,
	TextField,
	type TextFieldProps,
	type SwitchProps,
	SvgIcon,
} from '@mui/material';

import CheckBoxSharpIcon from "react:~assets/checkbox-checked.svg"
import CheckBoxOutlineBlankSharpIcon from "react:~assets/checkbox-unchecked.svg"

import { useSyncStorage } from '~hooks/useStorage';
import { setSyncStorage } from "~util/storage";
import { type SyncKey } from '~util/storage';

type PersistedInputProps = {
	component: 'checkbox' | 'select' | 'textfield' | 'switch';
	storageKey: SyncKey;
	children?: React.ReactNode;
} & (CheckboxProps | SelectProps | TextFieldProps | SwitchProps);

export default function PersistedInput({
	component,
	storageKey,
	children,
	...props
}: PersistedInputProps) {
	const data = useSyncStorage([storageKey]);

	const onChangeProxy = async (event: any, ...rest: any) => {
		if (props.onChange) {
			props.onChange(event, rest);
		}

		const value =
			component === 'checkbox'
				? event.target.checked
				: event.target.value;
		await setSyncStorage({ [storageKey]: value })
	};

	let without = Object.assign({}, props) as any;
	let element = <></>;

	switch (component) {
		case 'checkbox': {
			return (
				<Checkbox
					{...without}
					onChange={onChangeProxy}
					icon={<SvgIcon><CheckBoxOutlineBlankSharpIcon /></SvgIcon>}
					checkedIcon={<SvgIcon><CheckBoxSharpIcon /></SvgIcon>}
					checked={data[storageKey]}
				>
					{children}
				</Checkbox>
			);
		}
		case 'textfield': {
			delete without.children;

			return (
				<TextField
					{...without}
					onChange={onChangeProxy}
					value={data[storageKey]}
				>
					{children}
				</TextField>
			);
		}
		case 'select': {
			delete without.children;

			return (
				<Select
					{...without}
					onChange={onChangeProxy}
					value={data[storageKey]}
				>
					{children}
				</Select>
			);
		}
		case 'switch': {
			return (
				<Switch
					{...without}
					onChange={onChangeProxy}
					value={data[storageKey]}
				/>
			);
		}
	}
	return element;
}
