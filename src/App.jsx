import { Button } from '@mui/material';
import './App.css';
import { AccessAlarm } from '@mui/icons-material';
import ThreeDRotation from '@mui/icons-material/ThreeDRotation';
import Typography from '@mui/material/Typography';
function App() {
  return (
    <>
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
