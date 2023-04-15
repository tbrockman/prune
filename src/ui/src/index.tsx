import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BuildTargets } from './types';

function importBuildTarget() {
	if (process.env.REACT_APP_BUILD_TARGET) {
		return import(process.env.REACT_APP_BUILD_TARGET);
	} else {
		return Promise.reject(
			new Error(
				'No such build target: ' + process.env.REACT_APP_BUILD_TARGET,
			),
		);
	}
}

importBuildTarget().then(({ default: Environment }) => {
	let rootElement;

	if (process.env.REACT_APP_BUILD_TARGET === BuildTargets.Options) {
		rootElement = document.getElementById('root') as HTMLElement;
	} else {
		const element = document.createElement('div');
		element.className = 'content-script';
		document.body.prepend(element);
		rootElement = element;
	}
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<React.StrictMode>
			<Environment />
		</React.StrictMode>,
	);
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
