import { useColorScheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
function ModeSelect() {
  const { mode, setMode } = useColorScheme();

  const handleChange = (event) => {
    const selectedMode = event.target.value;
    setMode(selectedMode);
  };

  return (
    <FormControl sx={{ m: 4, minWidth: 120 }} size="small">
      <InputLabel id="label-dark-light-mode">Mode</InputLabel>
      <Select
        labelId="label-dark-light-mode"
        id="select-mode"
        value={mode}
        label="Mode"
        onChange={handleChange}
      >
        <MenuItem value="light">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Light <LightModeIcon fontSize="small" />
          </div>
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
function App() {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <Box
        sx={{
          height: (theme) => theme.trello.headerHeight,
          width: '100%',
          backgroundColor: 'primary.light',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <ModeSelect />
      </Box>
      <Box
        sx={{
          height: (theme) => theme.trello.boardBarHeight,
          width: '100%',
          backgroundColor: 'primary.dark',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        Board Bar
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: (theme) =>
            `calc(100vh - ${theme.trello.headerHeight} - ${theme.trello.boardBarHeight})`,
          backgroundColor: 'primary.main'
        }}
      >
        Board Content
      </Box>
    </Container>
  );
}

export default App;
