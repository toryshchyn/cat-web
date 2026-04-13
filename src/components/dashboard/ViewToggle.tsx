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
      <ToggleButton
        value="cloud"
        sx={{ px: { xs: 1.2, sm: 2 }, py: { xs: 0.35, sm: 0.75 }, fontSize: { xs: "0.72rem", sm: "0.875rem" } }}
      >
        Cloud
      </ToggleButton>
      <ToggleButton
        value="list"
        sx={{ px: { xs: 1.2, sm: 2 }, py: { xs: 0.35, sm: 0.75 }, fontSize: { xs: "0.72rem", sm: "0.875rem" } }}
      >
        List
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
