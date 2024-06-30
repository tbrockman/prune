import { Box, Stack, Typography } from "@mui/material";
import './KeyShortcut.css';
import { useStore } from "~hooks/useStore";
import type { NamedCommands } from "~types";

export type KeyShortcutProps = {
    commandName: NamedCommands;
}

export function KeyShortcut({ commandName }: KeyShortcutProps) {
    const command = useStore((state) => state.commands[commandName]);

    let elements = [];
    let keys = command?.shortcut?.split('+') || [];

    // handle mac which seems to not use '+' as a separator for keys
    if (keys.length === 1) {
        keys = Array.from(command?.shortcut) || [];
    }

    keys.forEach((item, index) => {
        elements.push(
            <Box key={`${item}_${index}`} className="keyboard-shortcut-key"><Typography fontSize={'12px'}>{item}</Typography></Box>
        )

        if (index < keys.length - 1 && keys.length > 1) {
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