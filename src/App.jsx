import { Button } from '@mui/material';
import { AccessAlarm } from '@mui/icons-material';
import ThreeDRotation from '@mui/icons-material/ThreeDRotation';
import Typography from '@mui/material/Typography';
import { useColorScheme } from '@mui/material/styles';

function ModeToggle() {
  const { mode, setMode } = useColorScheme();
  return (
    <Button
      onClick={() => {
        setMode(mode === 'light' ? 'dark' : 'light');
      }}
    >
      {mode === 'light' ? 'Turn dark' : 'Turn light'}
    </Button>
  );
}
function App() {
  return (
    <>
      <ModeToggle />
      <hr />
      <h1>Bảo Ngô</h1>
      <Typography variant="h1" color="text.secondary">
        Test Typography
      </Typography>
      <Button variant="contained">Contained</Button>
      <Button variant="text">Text</Button>
      <Button variant="outlined">Outlined</Button>
      <AccessAlarm />
      <ThreeDRotation />
    </>
  );
}

export default App;
