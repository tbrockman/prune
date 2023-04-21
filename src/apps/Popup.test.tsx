import React from 'react';
import { render, screen } from '@testing-library/react';
import Popup from './Popup';

test('renders learn react link', () => {
	render(<Popup />);
	const linkElement = screen.getByText(/learn react/i);
	expect(linkElement).toBeInTheDocument();
});
