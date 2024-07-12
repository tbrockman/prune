import './FormOption.css';

export function FormOption(props: any) {
	let className = 'form-option';

	if (Object.prototype.hasOwnProperty.call(props, 'className')) {
		className += ' ' + props.className;
	}

	let without = Object.assign({}, props);
	without.className = className;
	delete without.children;

	return <div {...without}>{props.children}</div>;
}
