import { Box, Stack, Typography } from "@mui/material";
import './KeyShortcut.css';
import useOptions from "~hooks/useOptions";

export type KeyShortcutProps = {
    modifiers: string[];
    keys: string[];
}

export function KeyShortcut({ modifiers, keys }: KeyShortcutProps) {

    const concat = modifiers.concat(keys);
    let elements = [];

    concat.forEach((item, index) => {
        elements.push(
            <Box key={`${item}_${index}`} className="keyboard-shortcut-key"><Typography fontSize={'12px'}>{item}</Typography></Box>
        )

        if (index < concat.length - 1 && concat.length > 1) {
            elements.push(
                <Box key={`plus_${index}`} className="keyboard-shortcut-plus"><Typography>+</Typography></Box>
            )
        }
    })

    return (
        <Stack direction="row" spacing={0.5}>
            {elements}
        </Stack>
    )
}