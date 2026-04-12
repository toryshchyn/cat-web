import { ToggleButton, ToggleButtonGroup } from "@mui/material";

type Props = {
  mode: "cloud" | "list";
  onChange: (mode: "cloud" | "list") => void;
};

export default function ViewToggle({ mode, onChange }: Props) {
  return (
    <ToggleButtonGroup
      value={mode}
      exclusive
      onChange={(_, val) => val && onChange(val)}
      sx={{ mb: 2 }}
    >
      <ToggleButton value="cloud">Cloud</ToggleButton>
      <ToggleButton value="list">List</ToggleButton>
    </ToggleButtonGroup>
  );
}
