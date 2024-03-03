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
} from '@mui/material';
import useOptions from '../hooks/useOptions';
import { Options } from '../util/';

type PersistedInputProps = {
	component: 'checkbox' | 'select' | 'textfield' | 'switch';
	storageKey: keyof Options;
	children?: React.ReactNode;
} & (CheckboxProps | SelectProps | TextFieldProps | SwitchProps);

export default function PersistedInput({
	component,
	storageKey,
	children,
	...props
}: PersistedInputProps) {
	const { options, setOptionAsync } = useOptions();

	const onChangeProxy = async (event: any, ...rest: any) => {
		if (props.onChange) {
			props.onChange(event, rest);
		}
		const value =
			component === 'checkbox'
				? event.target.checked
				: event.target.value;
		await setOptionAsync(storageKey, value);
	};

	let without = Object.assign({}, props) as any;
	let element = <></>;

	switch (component) {
		case 'checkbox': {
			return (
				<Checkbox
					{...without}
					onChange={onChangeProxy}
					checked={options[storageKey] as boolean}
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
					value={options[storageKey]}
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
					value={options[storageKey]}
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
					value={options[storageKey]}
				/>
			);
		}
	}
	return element;
}
