import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

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
	const root = ReactDOM.createRoot(
		document.getElementById('root') as HTMLElement,
	);
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
