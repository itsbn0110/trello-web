import Box from '@mui/material/Box';

function BoardBar() {
  return (
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
  );
}

export default BoardBar;
