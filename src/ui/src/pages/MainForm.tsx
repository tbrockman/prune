import React, { ChangeEvent } from 'react';
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import './MainForm.css'
import TipForm from '../components/TipForm';
import { FormOption } from '../components/FormOption';
import { PruneConfig } from '../config';
import useOptions from '../hooks/useOptions';
import { Options } from '../util';

function DeduplicateBlock() {

    const [options, setOptionAsync] = useOptions()

    console.log('rerendering', options?.['auto-deduplicate'])

    const dedupChanged = async (event: ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.checked)
        await setOptionAsync('auto-deduplicate', event.target.checked)
    }

    console.log('options in form', options)

    const control = <Checkbox value={options?.['auto-deduplicate']} checked={options?.['auto-deduplicate']} onChange={dedupChanged}></Checkbox>

    return (
        <FormOption>
            <FormControlLabel
                control={control}
                label='focus existing tabs instead of opening duplicates'
            />
        </FormOption>
    )
}

function GroupTabsBlock() {
    return (
        <FormOption>
            <FormControlLabel
                control={
                    (<Checkbox></Checkbox>)
                }
                label='hide tabs after'
            />
            <FormControlLabel
                control={(
                    <TextField hiddenLabel size='small' variant='filled' type="number"
                        InputProps={{
                            inputProps: {
                                max: 100, min: 0
                            }
                        }}
                    />
                )}
                label='days in a group named'
            />
            <FormControlLabel
                control={(
                    <TextField hiddenLabel size='small' placeholder='old tabs' variant='filled' fullWidth={false}></TextField>
                )}
                label=''
            />
        </FormOption>
    )
}

function StorageBlock() {
    return (
        <FormOption>
            <FormControlLabel
                control={
                    (<Checkbox></Checkbox>)
                }
                label='bookmark closed tabs under'
            />
            <FormControlLabel
                control={(
                    <TextField hiddenLabel size='small' placeholder='pruned' variant='filled' fullWidth={false}></TextField>
                )}
                label=''
            />
        </FormOption>
    )
}

function LRUBlock() {
    return (
        <FormOption className='lru-options'>
            <FormControl className='lru-options-control'>
                <FormControlLabel
                    control={
                        (
                            <>
                                <Checkbox></Checkbox>
                                <Select>
                                    <MenuItem>group</MenuItem>
                                    <MenuItem>close</MenuItem>
                                </Select>
                            </>

                        )
                    }
                    label='least recently used tabs after'
                />
                <FormControlLabel
                    control={(
                        <TextField hiddenLabel size='small' variant='filled' type="number"
                            InputProps={{
                                inputProps: {
                                    max: 255, min: 0
                                }
                            }}
                        />
                    )}
                    label=''
                />
            </FormControl>
        </FormOption>
    )
}

function RemoveTabsBlock() {
    return (
        <FormOption>
            <FormControlLabel
                control={
                    (<Checkbox></Checkbox>)
                }
                label='close old tabs after'
            />
            <FormControlLabel
                control={
                    (
                        <TextField hiddenLabel size='small' variant='filled' type="number"
                            InputProps={{
                                inputProps: {
                                    max: 1024, min: 0
                                }
                            }}
                        />
                    )
                }
                label='days'
            />
        </FormOption>
    )
}

export default function MainForm() {

    return (
        <FormGroup className='main-form-group'>
            <DeduplicateBlock />
            <GroupTabsBlock />
            <RemoveTabsBlock />
            <StorageBlock />
            <LRUBlock />
            <TipForm />
        </FormGroup>
    )
}