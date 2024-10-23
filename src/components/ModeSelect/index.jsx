import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
function ModeSelect() {
  const { mode, setMode } = useColorScheme();

  const handleChange = (event) => {
    const selectedMode = event.target.value;
    setMode(selectedMode);
  };

  return (
    <FormControl size="small" sx={{ minWidth: '120px' }}>
      <InputLabel id="label-dark-light-mode">Mode</InputLabel>
      <Select labelId="label-dark-light-mode" id="select-mode" value={mode} label="Mode" onChange={handleChange}>
        <MenuItem value="light">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Light <LightModeIcon fontSize="small" />
          </Box>
        </MenuItem>
        <MenuItem value="dark">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Dark <DarkModeIcon fontSize="small" />
          </Box>
        </MenuItem>
        <MenuItem value="system">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            System <SettingsBrightnessIcon fontSize="small" />
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  );
}
export default ModeSelect;
