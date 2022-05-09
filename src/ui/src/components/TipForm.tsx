import React from 'react';

import { LoadingButton } from '@mui/lab';
import { FormGroup, FormLabel, InputAdornment, TextField } from '@mui/material';
import { FormOption } from './FormOption';
import './TipForm.css'
import useTipClient from '../hooks/useTipClient';


export default function TipForm() {

    const tipClient = useTipClient()

    return (
        <FormOption>
            <FormGroup className='tip-form-group'>
                <FormLabel>support the developer: </FormLabel>
                <TextField margin='dense' hiddenLabel size='small' variant='filled' type="number"
                    InputProps={{
                        inputProps: {
                            min: 2,
                            max: 1000
                        },
                        startAdornment: (<InputAdornment position="start">$</InputAdornment>)
                    }}
                />
                <LoadingButton color='primary' variant='contained'>tip</LoadingButton>
            </FormGroup>
        </FormOption>

    )
}