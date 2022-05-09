import { Paper } from '@mui/material';
import React from 'react';

import './FormOption.css'

export function FormOption(props: any) {

    let className = 'form-option'

    if (props.hasOwnProperty('className')) {
        className += ' ' + props.className
    }

    return (
        <div {...props} className={className}>
            {props.children}
        </div>
    );
}
