import React from 'react';

import './FormOption.css';

export function FormOption(props: any) {
	let className = 'form-option';

	if (Object.prototype.hasOwnProperty.call(props, 'className')) {
		className += ' ' + props.className;
	}


	let without = Object.assign({}, props);
	without.className = className;
	delete without.children;

	console.log(props)
	console.log(without)

	return <div {...without}>{props.children}</div>;
}
