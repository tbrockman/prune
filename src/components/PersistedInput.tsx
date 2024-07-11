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

import CheckBoxSharpIcon from "react:~assets/checkbox-checked.svg";
import CheckBoxOutlineBlankSharpIcon from "react:~assets/checkbox-unchecked.svg";

import { useSyncStorage } from '~hooks/useStorage';
import { setSyncStorage } from "~util/storage";
import type { SyncStorageKeys } from '~enums';

type ComponentTypeMap = {
	'checkbox': CheckboxProps;
	'select': SelectProps;
	'textfield': TextFieldProps;
	'switch': SwitchProps;
};
export type PersistedInputProps<T extends keyof ComponentTypeMap, S extends ComponentTypeMap[T]> = {
	component: T;
	storageKey: SyncStorageKeys;
	children?: React.ReactNode;
} & Omit<S, 'component'>;

export default function PersistedInput<T extends keyof ComponentTypeMap>({
	component,
	storageKey,
	children,
	...props
}: PersistedInputProps<T, ComponentTypeMap[T]>) {
	const data = useSyncStorage([storageKey]);

	const onChangeProxy = async (event: any, ...rest: any[]) => {
		if (props.onChange) {
			// @ts-ignore
			props.onChange(event, ...rest);
		}

		const value =
			component === 'checkbox'
				? event.target.checked
				: event.target.value;
		await setSyncStorage({ [storageKey]: value });
	};

	switch (component) {
		case 'checkbox': {
			return (
				<Checkbox
					{...(props as CheckboxProps)}
					onChange={onChangeProxy}
					icon={<SvgIcon><CheckBoxOutlineBlankSharpIcon /></SvgIcon>}
					checkedIcon={<SvgIcon><CheckBoxSharpIcon /></SvgIcon>}
					checked={data[storageKey] as boolean}
				/>
			);
		}
		case 'textfield': {
			return (
				<TextField
					{...(props as TextFieldProps)}
					onChange={onChangeProxy}
					value={data[storageKey]}
				>
					{children}
				</TextField>
			);
		}
		case 'select': {
			return (
				<Select
					{...(props as SelectProps)}
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
					{...(props as SwitchProps)}
					onChange={onChangeProxy}
					checked={data[storageKey] as boolean}
				/>
			);
		}
	}
	return null;
}