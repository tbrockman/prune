import {
	Checkbox,
	CheckboxProps,
	Select,
	SelectProps,
	TextField,
	TextFieldProps,
} from '@mui/material';
import useOptions from '../hooks/useOptions';
import { Options } from '../util/';

type OptionsPersistedInputProps = {
	component: 'checkbox' | 'select' | 'textfield';
	storageKey: keyof Options;
} & (CheckboxProps | SelectProps | TextFieldProps);

export default function OptionsPersistedInput({
	component,
	storageKey,
	...props
}: OptionsPersistedInputProps) {
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
				/>
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
					{(props as TextFieldProps).children}
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
					{(props as SelectProps).children}
				</Select>
			);
		}
	}
	return element;
}
