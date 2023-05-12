import React from "react";
import { Chip, FormControlLabel, IconButton, Tooltip } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { FormOption } from "./FormOption";
import LabelWithHint from "./LabelWithHint";
import PersistedInput from "./PersistedInput";
import { useStore, Page } from "../hooks/useStore";
import { StorageKeys } from "~enums";

export default function ProductivityBlock() {
  const setPage = useStore((state) => state.setPage);
  const page = useStore((state) => state.page);

  const hint =
    "helps keep your browsing productive by blocking use of typical time wasting websites.";
  // const label = "turn on productivity mode 👨‍💻";
  const label = (
    <div style={{display: 'flex', alignItems: 'center'}}>

      <span>turn on productivity mode 👨‍💻</span>
      <Chip variant='outlined' label='beta🧪' style={{
        fontFamily: 'monospace',
            backgroundColor: '#673b97',
            color: 'yellow'
      }}/>
    </div>
  )

  const settingsIconClicked = () => {
    setPage(Page.ProductivitySettings);
  };

  const backButtonClicked = () => {
    setPage(Page.Home);
  };

  return (
    <FormOption>
      <FormControlLabel
        control={
          <PersistedInput
            component="checkbox"
            storageKey={StorageKeys.PRODUCTIVITY_MODE_ENABLED}
          />
        }
        label={
          <LabelWithHint
            hint={hint}
            label={label}
            tooltipProps={{ placement: "top" }}
          />
        }
      />
      {page !== Page.ProductivitySettings ? (
        <Tooltip
          placement="top"
          arrow={true}
          title="change productivity mode settings"
        >
          <IconButton aria-label="settings" onClick={settingsIconClicked}>
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip placement="top" arrow={true} title="back to main options">
          <IconButton aria-label="main options" onClick={backButtonClicked}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
      )}
    </FormOption>
  );
}
