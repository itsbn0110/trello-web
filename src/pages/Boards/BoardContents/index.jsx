import Box from '@mui/material/Box';

function BoardContent() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: (theme) => `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#0f71d2')
      }}
    >
      Board Content
    </Box>
  );
}

export default BoardContent;
