import Accordion from '@mui/material/Accordion';
import { ExemptPagesBlock } from "./ExemptPagesBlock";
import ProductivityBlock from "./ProductivityBlock";
import { AccordionDetails, AccordionSummary, Tooltip, Typography } from '@mui/material';

import './AdvancedSettingsBlock.css';
import { useStorage } from '@plasmohq/storage/hook';
import { StorageKeys } from '~enums';
import type React from 'react';
import LabelWithHint from './LabelWithHint';

export function AdvancedSettingsBlock() {
    const [showAdvancedSettings, setShowAdvancedSettings] = useStorage(
        StorageKeys.SHOW_ADVANCED_SETTINGS,
        false,
    );

    const advancedSettingsLabel = chrome.i18n.getMessage('advancedSettingsLabel');
    const advancedSettingsHint = chrome.i18n.getMessage('advancedSettingsHint');

    const handleAdvancedSettingsChange = (_: React.SyntheticEvent, isExpanded: boolean) => {
        setShowAdvancedSettings(isExpanded);
    }

    return (
        <>
            <Accordion expanded={showAdvancedSettings} onChange={handleAdvancedSettingsChange} disableGutters elevation={0} square>
                <AccordionSummary className='advanced-settings-summary' expandIcon={<Typography>⚙️</Typography>}>
                    <LabelWithHint label={
                        <Typography>
                            {advancedSettingsLabel}
                        </Typography>
                    } hint={advancedSettingsHint} />
                </AccordionSummary>
                <AccordionDetails className='advanced-settings-details'>
                    <ExemptPagesBlock />
                    {/* TODO: <ProductivityBlock /> */}
                </AccordionDetails>
            </Accordion >
        </>

    )
}