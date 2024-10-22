import Box from '@mui/material/Box';
import ModeSelect from '~/components/ModeSelect';
function AppBar() {
  return (
    <Box
      sx={{
        height: (theme) => theme.trello.appBarHeight,
        width: '100%',
        backgroundColor: 'primary.light',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <ModeSelect />
    </Box>
  );
}

export default AppBar;
